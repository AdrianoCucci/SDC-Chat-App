import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { merge, Observable, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { RoomPing } from 'src/app/core/models/room-pings/room-ping';
import { RoomPingState } from 'src/app/core/models/room-pings/room-ping-state';
import { User } from 'src/app/core/models/users/user';
import { ChatService } from 'src/app/core/services/web-socket/chat.service';
import { RoomPingsService } from 'src/app/core/services/web-socket/room-pings.service';
import { MenuItem } from 'src/app/shared/models/menu-item';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenu implements OnInit, OnDestroy {
  @Input() public menuItems: MenuItem[];
  @Input() public clientUser: User;

  public readonly roomPingRequestsCount$: Observable<number> =
    this._roomPingsService.pings$.pipe(
      map((value: RoomPing[]) => {
        const predicate = (r: RoomPing) =>
          r.requestUserId !== this.clientUser.id &&
          r.state === RoomPingState.Requesting;

        return value.filter(predicate).length;
      }),
      tap((value: number) => (this.roomPingRequestsCount = value))
    );

  public newMessagesCount: number = 0;
  public roomPingRequestsCount: number = 0;

  private readonly _destroyed$ = new Subject<void>();

  constructor(
    private _chatService: ChatService,
    private _roomPingsService: RoomPingsService
  ) {}

  ngOnInit(): void {
    merge(
      this.roomPingRequestsCount$,
      this._chatService.newMessagesCount$.pipe(
        tap((value: number) => (this.newMessagesCount = value))
      )
    )
      .pipe(takeUntil(this._destroyed$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  public getDisplayCount(count: number) {
    return count > 99 ? '99+' : count.toString();
  }
}
