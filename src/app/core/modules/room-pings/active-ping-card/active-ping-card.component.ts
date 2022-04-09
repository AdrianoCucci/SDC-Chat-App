import { Component, HostBinding, Input } from '@angular/core';
import { RoomPing } from 'src/app/core/models/room-pings/room-ping';
import { RoomPingState } from 'src/app/core/models/room-pings/room-ping-state';
import { Room } from 'src/app/core/models/rooms/room';
import { User } from 'src/app/core/models/users/user';
import { RoomPingsService } from 'src/app/core/services/web-socket/room-pings.service';

@Component({
  selector: 'app-active-ping-card',
  templateUrl: './active-ping-card.component.html',
  styleUrls: ['./active-ping-card.component.scss']
})
export class ActivePingCard {
  @Input() public roomPing: RoomPing;
  @Input() public clientUser: User;

  @HostBinding("class.dismissing") private _dismissing: boolean = false;

  constructor(private _roomPingsService: RoomPingsService) { }

  async onRespond(message?: string): Promise<void> {
    const roomPing: RoomPing = this.roomPing;
    roomPing.state = RoomPingState.Responded;
    roomPing.responseMessage = message || "On my way!";
    roomPing.responseUserId = this.clientUser?.id;

    this.roomPing = await this._roomPingsService.sendPingResponse(roomPing);
  }

  onCancel() {
    this._roomPingsService.cancelPingRequest(this.roomPing);
  }

  onDismiss(): void {
    this._dismissing = true;
    setTimeout(() => this._roomPingsService.removePing(this.roomPing.guid), 160);
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

  @HostBinding("class.requesting") public get isRequesting(): boolean {
    return this.roomPing?.state === RoomPingState.Requesting;
  }

  @HostBinding("class.client-request") public get isClientRequest(): boolean {
    return this.isRequesting && this.clientUser?.id === this.roomPing.requestUserId;
  }

  @HostBinding("class.responded") public get isResponded(): boolean {
    return this.roomPing?.state === RoomPingState.Responded;
  }

  public get dismissing(): boolean {
    return this._dismissing;
  }
}