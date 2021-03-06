import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RoomPing } from 'src/app/core/models/room-pings/room-ping';
import { RoomPingState } from 'src/app/core/models/room-pings/room-ping-state';
import { Room } from 'src/app/core/models/rooms/room';
import { User } from 'src/app/core/models/users/user';
import { WebSocketService } from 'src/app/core/services/web-socket/web-socket.service';

@Component({
  selector: 'app-room-ping-card',
  templateUrl: './room-ping-card.component.html',
  styleUrls: ['./room-ping-card.component.scss']
})
export class RoomPingCard implements OnInit, OnDestroy {
  @Input() public room: Room;
  @Input() public roomPing: RoomPing;
  @Input() public clientUser: User;

  private _subscriptions: Subscription;

  constructor(private _socketService: WebSocketService) { }

  ngOnInit(): void {
    this.initRoomPingEvents();
    this.initCurrentRoomPingState();
  }

  ngOnDestroy(): void {
    this._subscriptions?.unsubscribe();
    this._subscriptions = null;
  }

  private initRoomPingEvents(): void {
    this._subscriptions = new Subscription();

    this._subscriptions.add(this._socketService.roomPings.onPingRequest.subscribe((roomPing: RoomPing) => {
      if(roomPing.roomId === this.room?.id) {
        this.roomPing = roomPing;
      }
    }));

    this._subscriptions.add(this._socketService.roomPings.onPingResponse.subscribe((roomPing: RoomPing) => {
      if(roomPing.roomId === this.room?.id) {
        this.roomPing = roomPing;
      }
    }));

    this._subscriptions.add(this._socketService.roomPings.onPingCancel.subscribe((roomPing: RoomPing) => {
      if(roomPing.roomId === this.room?.id) {
        this.roomPing = null;
      }
    }));
  }

  private initCurrentRoomPingState(): void {
    if(this.room != null) {
      const pings: RoomPing[] = this._socketService.roomPings.pings;

      if(pings != null) {
        const thisRoomPing: RoomPing = pings.find((r: RoomPing) => r.roomId === this.room.id);

        if(thisRoomPing != null) {
          this.roomPing = thisRoomPing;
        }
      }
    }
  }

  async onRequest(message?: string): Promise<void> {
    this.roomPing = await this._socketService.roomPings.sendPingRequest({
      state: RoomPingState.Requesting,
      roomId: this.room?.id,
      room: this.room,
      organizationId: this.clientUser?.organizationId,
      requestDate: new Date().toISOString(),
      requestMessage: message?.trim() || "Need assistance!",
      requestUserId: this.clientUser?.id
    });
  }

  async onResponse(message?: string): Promise<void> {
    const roomPing: RoomPing = this.roomPing;
    roomPing.state = RoomPingState.Responded;
    roomPing.responseMessage = message?.trim() || "On my way!";
    roomPing.responseUserId = this.clientUser?.id;

    this.roomPing = await this._socketService.roomPings.sendPingResponse(roomPing);
  }

  onCancel(): void {
    this._socketService.roomPings.cancelPingRequest(this.roomPing);
    this.roomPing = null;
  }

  @HostBinding("class.ping-request") public get isPingRequesting() {
    let result: boolean = false;

    if(this.room != null && this.roomPing != null) {
      result = this.roomPing.state === RoomPingState.Requesting && this.roomPing.roomId === this.room.id;
    }

    return result;
  }

  @HostBinding("class.client-ping-request") public get isClientPingRequesting() {
    let result: boolean = false;

    if(this.clientUser != null && this.roomPing != null) {
      result = this.roomPing.state === RoomPingState.Requesting && this.roomPing.requestUserId === this.clientUser.id;
    }

    return result;
  }
}