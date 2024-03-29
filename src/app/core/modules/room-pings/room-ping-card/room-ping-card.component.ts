import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { RoomPing } from 'src/app/core/models/room-pings/room-ping';
import { RoomPingState } from 'src/app/core/models/room-pings/room-ping-state';
import { Room } from 'src/app/core/models/rooms/room';
import { User } from 'src/app/core/models/users/user';
import { RoomPingsService } from 'src/app/core/services/web-socket/room-pings.service';
import { EventSubscription } from 'src/app/shared/modules/events/event-subscription.model';
import { Event } from 'src/app/shared/modules/events/event.model';
import { EventsService } from 'src/app/shared/modules/events/events.service';

@Component({
  selector: 'app-room-ping-card',
  templateUrl: './room-ping-card.component.html',
  styleUrls: ['./room-ping-card.component.scss']
})
export class RoomPingCard implements OnInit, OnDestroy {
  @Input() public room: Room;
  @Input() public roomPing: RoomPing;
  @Input() public clientUser: User;

  private _subscription?: EventSubscription;

  constructor(private _roomPingsService: RoomPingsService, private _eventsService: EventsService) { }

  ngOnInit(): void {
    this.initRoomPingEvents();
    this.initCurrentRoomPingState();
  }

  ngOnDestroy(): void {
    this._eventsService.unsubscribe(this._subscription);
    this._subscription = undefined;
  }

  private initRoomPingEvents(): void {
    this._subscription = this._eventsService.subscribe({
      eventSources: RoomPingsService.name,
      eventHandler: this.onRoomPingEvent
    });
  }

  private onRoomPingEvent = (event: Event<RoomPing>): void => {
    if(event.data.roomId !== this.room?.id) {
      return;
    }

    switch(event.type) {
      case "room-ping-request":
      case "room-ping-response":
        this.roomPing = { ...event.data };
        break;
      case "room-ping-cancel":
        this.roomPing = null;
        break;
    }
  }

  private initCurrentRoomPingState(): void {
    if(this.room != null) {
      const pings: RoomPing[] = this._roomPingsService.pings;

      if(pings != null) {
        const thisRoomPing: RoomPing = pings.find((r: RoomPing) => r.roomId === this.room.id);

        if(thisRoomPing != null) {
          this.roomPing = thisRoomPing;
        }
      }
    }
  }

  async onRequest(message?: string): Promise<void> {
    this.roomPing = await this._roomPingsService.sendPingRequest({
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

    this.roomPing = await this._roomPingsService.sendPingResponse(roomPing);
  }

  onCancel(): void {
    this._roomPingsService.cancelPingRequest(this.roomPing);
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