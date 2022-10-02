import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { RoomPing } from 'src/app/core/models/room-pings/room-ping';
import { RoomPingState } from 'src/app/core/models/room-pings/room-ping-state';
import { Room } from 'src/app/core/models/rooms/room';
import { User } from 'src/app/core/models/users/user';
import { RoomPingsService } from 'src/app/core/services/web-socket/room-pings.service';

@Component({
  selector: 'app-active-ping-card',
  templateUrl: './active-ping-card.component.html',
  styleUrls: ['./active-ping-card.component.scss'],
})
export class ActivePingCard implements OnInit {
  @Input() public roomPing: RoomPing;
  @Input() public clientUser: User;

  public readonly roomPing$: Observable<RoomPing>;

  @HostBinding('class.dismissing') private _dismissing: boolean = false;

  constructor(private _roomPingsService: RoomPingsService) {
    this.roomPing$ = this._roomPingsService.pings$.pipe(
      map((value: RoomPing[]) =>
        value.find((r: RoomPing) => r.roomId === this.room?.id)
      ),
      tap((value: RoomPing | undefined) => (this.roomPing = value))
    );
  }

  ngOnInit(): void {
    this.roomPing$
      .pipe(takeUntil(this._roomPingsService.disposed$))
      .subscribe();
  }

  onRespond(message?: string): void {
    this._roomPingsService
      .sendPingResponse({
        ...this.roomPing,
        state: RoomPingState.Responded,
        responseMessage: message?.trim() || 'On my way!',
        responseUserId: this.clientUser?.id,
      })
      .subscribe((response: RoomPing) => (this.roomPing = response));
  }

  onCancel(): void {
    this._roomPingsService
      .cancelPingRequest(this.roomPing)
      .subscribe(() => (this.roomPing = null));
  }

  onDismiss(): void {
    this._dismissing = true;
    setTimeout(
      () => this._roomPingsService.removePing(this.roomPing.guid),
      160
    );
  }

  public get room(): Room {
    return this.roomPing?.room;
  }

  public get requestUser(): User {
    return this.roomPing?.requestUser;
  }

  public get responseUser(): User {
    return this.roomPing?.responseUser;
  }

  @HostBinding('class.requesting') public get isRequesting(): boolean {
    return this.roomPing?.state === RoomPingState.Requesting;
  }

  @HostBinding('class.client-request') public get isClientRequest(): boolean {
    return (
      this.isRequesting && this.clientUser?.id === this.roomPing.requestUserId
    );
  }

  @HostBinding('class.responded') public get isResponded(): boolean {
    return this.roomPing?.state === RoomPingState.Responded;
  }

  public get dismissing(): boolean {
    return this._dismissing;
  }
}
