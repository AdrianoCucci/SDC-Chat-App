import { Injectable } from "@angular/core";
import { IDisposable } from "src/app/shared/interfaces/i-disposable";
import { EventSubscription } from "src/app/shared/modules/events/event-subscription.model";
import { Event } from "src/app/shared/modules/events/event.model";
import { EventsService } from "src/app/shared/modules/events/events.service";
import { ChatMessage } from "../../models/messages/chat-message";
import { RoomPing } from "../../models/room-pings/room-ping";
import { Room } from "../../models/rooms/room";
import { User } from "../../models/users/user";
import { ChatService } from "../web-socket/chat.service";
import { RoomPingsService } from "../web-socket/room-pings.service";
import { SwNotificationsService } from "./sw-notifications.service";

@Injectable({
  providedIn: 'root'
})
export class EventNotificationsService implements IDisposable {
  private _subscriptions: EventSubscription[];

  constructor(private _eventsService: EventsService, private _swNotificationsService: SwNotificationsService) { }

  public registerEvents(): void {
    this.dispose();
    const subscriptions: EventSubscription[] = [];

    subscriptions.push(this._eventsService.subscribe({
      eventSources: ChatService.name,
      eventTypes: "message",
      eventHandler: (event: Event<ChatMessage>) => {
        const senderUser: User = event.data.senderUser;
        const title: string = senderUser
          ? `${senderUser.displayName || senderUser.username} posted a message`
          : "New Chat Message";

        this._swNotificationsService.showNotification(title, {
          data: event.data,
          body: event.data.contents
        });
      }
    }));

    subscriptions.push(this._eventsService.subscribe({
      eventSources: RoomPingsService.name,
      eventTypes: "room-ping-request",
      eventHandler: (event: Event<RoomPing>) => {
        const requestUser: User = event.data.requestUser;
        const room: Room = event.data.room;

        const title: string = [
          `${requestUser ? `${requestUser.displayName || requestUser.username} is pinging ` : ""}`,
          room?.name ?? ""
        ].join('') ?? "Room Ping";

        this._swNotificationsService.showNotification(title, {
          data: event.data,
          body: event.data.requestMessage
        });
      }
    }));

    this._subscriptions = subscriptions;
  }

  public dispose(): void {
    if(this._subscriptions) {
      this._eventsService.unsubscribeMany(this._subscriptions);
      this._subscriptions = undefined;
    }
  }
}