import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDisposable } from 'src/app/shared/interfaces/i-disposable';
import { PagedList } from 'src/app/shared/models/pagination/paged-list';
import { Event } from 'src/app/shared/modules/events/event.model';
import { EventsService } from 'src/app/shared/modules/events/events.service';
import { User } from '../../models/users/user';
import { UsersService } from '../api/users-service';
import { LoginService } from '../login.service';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root',
})
export class SocketUsersService implements IDisposable {
  private _users: PagedList<User>;
  private _clientUser: User;

  constructor(
    private _socketService: WebSocketService,
    private _eventsService: EventsService,
    private _usersService: UsersService
  ) {
    this.subsribeEvents();
  }

  public dispose(): void {
    this._users = null;
    this._clientUser = null;
  }

  private subsribeEvents(): void {
    const socket: WebSocketService = this._socketService;
    const events = this.socketEvents;
    const eventsService: EventsService = this._eventsService;
    const eventsSource: string = this.constructor.name;

    socket.on<User>(events.userJoin, (user: User) => {
      this.updateUser(user);

      eventsService.publish({
        source: eventsSource,
        type: events.userJoin,
        data: user,
      });
    });

    socket.on<User>(events.userLeave, (user: User) => {
      this.updateUser(user);

      eventsService.publish({
        source: eventsSource,
        type: events.userLeave,
        data: user,
      });
    });

    eventsService.subscribe({
      eventSources: WebSocketService.name,
      eventTypes: 'connect',
      eventHandler: (event: Event) => {
        if (event.data.isReconnection && this._clientUser != null) {
          this.joinClientUser(this._clientUser);
        }
      },
    });

    eventsService.subscribe({
      eventSources: LoginService.name,
      eventTypes: 'logout',
      eventHandler: () => this.dispose(),
    });
  }

  public loadUsers(organizationId: number): Promise<PagedList<User>> {
    return new Promise<PagedList<User>>(async (resolve, reject) => {
      try {
        const response: HttpResponse<PagedList<User>> = await this._usersService
          .getAllUsers({ organizationId })
          .toPromise();
        this._users = response.body;

        resolve(this._users);
      } catch (error) {
        reject(error);
      }
    });
  }

  public joinClientUser(clientUser: User): void {
    if (clientUser == null) {
      throw new Error('[clientUser] cannot be null');
    }

    this._socketService.emit(
      this.socketEvents.userJoin,
      clientUser,
      (response: User) => {
        this._clientUser = response;
        const index: number = this.findUserIndex(this._clientUser.id);

        if (index === -1) {
          this.addUser(this._clientUser);
        } else {
          this.updateUser(this._clientUser);
        }
      }
    );
  }

  public findUserIndex(userId: number): number {
    return this._users?.data.findIndex((u: User) => u.id === userId) ?? -1;
  }

  private addUser(user: User): void {
    if (this._users == null) {
      this._users = { data: [user], pagination: null };
    } else {
      this._users.data.push(user);
    }
  }

  private updateUser(user: User): void {
    const index: number = this._users?.data.findIndex(
      (u: User) => u.id === user.id
    );

    if (index !== -1) {
      this._users.data[index] = user;
    }
  }

  public get socketEvents() {
    return {
      userJoin: 'user-join',
      userLeave: 'user-leave',
    };
  }

  public get users(): PagedList<User> {
    return this._users;
  }
}
