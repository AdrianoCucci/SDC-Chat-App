import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { RoomPing } from 'src/app/core/models/room-pings/room-ping';
import { RoomPingState } from 'src/app/core/models/room-pings/room-ping-state';
import { Room } from 'src/app/core/models/rooms/room';
import { User } from 'src/app/core/models/users/user';
import { RoomPingsService } from 'src/app/core/services/web-socket/room-pings.service';

@Component({
  selector: 'app-room-ping-card',
  templateUrl: './room-ping-card.component.html',
  styleUrls: ['./room-ping-card.component.scss'],
})
export class RoomPingCard implements OnInit {
  @Input() public room: Room;
  @Input() public roomPing: RoomPing;
  @Input() public clientUser: User;

  public readonly roomPing$: Observable<RoomPing>;

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

  onRequest(message?: string): void {
    this._roomPingsService
      .sendPingRequest({
        state: RoomPingState.Requesting,
        roomId: this.room?.id,
        room: this.room,
        organizationId: this.clientUser?.organizationId,
        requestDate: new Date().toISOString(),
        requestMessage: message?.trim() || 'Need assistance!',
        requestUserId: this.clientUser?.id,
      })
      .subscribe((response: RoomPing) => (this.roomPing = response));
  }

  onResponse(message?: string): void {
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

  @HostBinding('class.ping-request') public get isPingRequesting() {
    let result: boolean = false;

    if (this.room && this.roomPing) {
      result =
        this.roomPing.state === RoomPingState.Requesting &&
        this.roomPing.roomId === this.room.id;
    }

    return result;
  }

  @HostBinding('class.client-ping-request')
  public get isClientPingRequesting() {
    let result: boolean = false;

    if (this.clientUser && this.roomPing) {
      result =
        this.roomPing.state === RoomPingState.Requesting &&
        this.roomPing.requestUserId === this.clientUser.id;
    }

    return result;
  }
}
