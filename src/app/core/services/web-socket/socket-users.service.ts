import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  merge,
  Observable,
  Subject,
  throwError,
  TimeoutError,
} from 'rxjs';
import { catchError, map, takeUntil, tap, timeout } from 'rxjs/operators';
import { emptyPagedList } from 'src/app/shared/functions/empty-paged-list';
import { PagedList } from 'src/app/shared/models/pagination/paged-list';
import { Event } from 'src/app/shared/modules/events/event.model';
import { EventsService } from 'src/app/shared/modules/events/events.service';
import { User } from '../../models/users/user';
import { UsersService } from '../api/users-service';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root',
})
export class SocketUsersService {
  public readonly disposed$: Observable<void>;

  private readonly _userJoin$ = new Subject<User>();
  private readonly _userLeave$ = new Subject<User>();

  private readonly _users$ = new BehaviorSubject<PagedList<User>>(
    emptyPagedList<User>()
  );

  private readonly _clientUser$ = new BehaviorSubject<User | undefined>(
    undefined
  );

  constructor(
    private _socketService: WebSocketService,
    private _eventsService: EventsService,
    private _usersService: UsersService
  ) {
    this.disposed$ = this._socketService.disposed$.pipe(
      tap(() => {
        this._userJoin$.complete();
        this._userLeave$.complete();
        this._users$.complete();
        this._clientUser$.complete();
      })
    );

    this.subscribeEvents();
  }

  private subscribeEvents(): void {
    merge(
      this._socketService.on(this.socketEvents.userJoin).pipe(
        tap((value: User) => {
          this.updateUser(value);

          this._eventsService.publish({
            source: this.constructor.name,
            type: this.socketEvents.userJoin,
            data: value,
          });

          this._userJoin$.next(value);
        })
      ),

      this._socketService.on(this.socketEvents.userLeave).pipe(
        tap((value: User) => {
          this.updateUser(value);

          this._eventsService.publish({
            source: this.constructor.name,
            type: this.socketEvents.userLeave,
            data: value,
          });

          this._userLeave$.next(value);
        })
      )
    )
      .pipe(takeUntil(this.disposed$))
      .subscribe();

    this._eventsService.subscribe({
      eventSources: WebSocketService.name,
      eventTypes: 'connect',
      eventHandler: (event: Event): void => {
        if (event.data.isReconnection && this._clientUser$.value) {
          this.joinClientUser(this._clientUser$.value).subscribe();
        }
      },
    });
  }

  public loadUsers(organizationId: number): Observable<PagedList<User>> {
    return this._usersService.getAllUsers({ organizationId }).pipe(
      map((response: HttpResponse<PagedList<User>>) => response.body),
      tap((users: PagedList<User>) => this._users$.next(users))
    );
  }

  public joinClientUser(clientUser: User): Observable<void> {
    if (!clientUser) {
      return throwError('[clientUser] cannot be null');
    }

    return this._socketService
      .emit<User>(this.socketEvents.userJoin, clientUser)
      .pipe(
        timeout(1000),
        catchError((error: any) => {
          if (error instanceof TimeoutError) {
            error.message = 'Failed to join client user after 10 seconds';
          }

          return throwError(error);
        }),
        tap((response: User) => {
          const index: number = this.findUserIndex(response.id);

          if (index === -1) {
            this.addUser(response);
          } else {
            this.updateUser(response);
          }

          this._clientUser$.next(response);
        }),
        map(() => null)
      );
  }

  public findUserIndex(userId: number): number {
    return (
      this._users$.value.data.findIndex((u: User) => u.id === userId) ?? -1
    );
  }

  private addUser(user: User): void {
    const current: PagedList<User> = this._users$.value;
    this._users$.next({ ...current, data: [...current.data, user] });
  }

  private updateUser(user: User): void {
    const current: PagedList<User> = this._users$.value;

    const index: number = current.data.findIndex((u: User) => u.id === user.id);

    if (index !== -1) {
      current.data[index] = user;
      this._users$.next(current);
    }
  }

  public get socketEvents() {
    return {
      userJoin: 'user-join',
      userLeave: 'user-leave',
    };
  }

  public get userJoin$(): Observable<User> {
    return this._userJoin$.asObservable();
  }

  public get userLeave$(): Observable<User> {
    return this._userLeave$.asObservable();
  }

  public get users$(): Observable<PagedList<User>> {
    return this._users$.asObservable();
  }

  public get clientUser$(): Observable<User | undefined> {
    return this._clientUser$.asObservable();
  }
}
