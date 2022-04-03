import { HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Socketio } from "ngx-socketio2";
import { Subscription, TeardownLogic } from "rxjs";
import { IDisposable } from "src/app/shared/interfaces/i-disposable";
import { PagedList } from "src/app/shared/models/pagination/paged-list";
import { Event } from "src/app/shared/modules/events/event.model";
import { EventsService } from "src/app/shared/modules/events/events.service";
import { subscribeMany } from "src/app/shared/util/rxjs-utils";
import { User } from "../../models/users/user";
import { ChatMessagesService } from "../api/chat-messages.service";
import { RoomsService } from "../api/rooms-service";
import { UsersService } from "../api/users-service";
import { AudioService } from "../audio/audio.service";
import { ChatController } from "./chat-controller";
import { RoomPingsController } from "./room-pings-controller";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements IDisposable {
  public readonly chat: ChatController;
  public readonly roomPings: RoomPingsController;

  protected readonly _socket: Socketio;

  private _subscription: Subscription;
  private _users: PagedList<User>;
  private _clientUser: User;

  constructor(
    private _eventsService: EventsService,
    private _usersService: UsersService,
    socket: Socketio,
    messagesService: ChatMessagesService,
    roomsService: RoomsService,
    audioService: AudioService
  ) {
    this._socket = socket;

    if(this._socket == null) {
      throw new Error(`[${this.constructor.name}] > [Socket] dependency is null`);
    }

    this._subscription = subscribeMany(this.getEventSubscriptions(socket));

    this.chat = new ChatController(socket, messagesService, audioService, _eventsService);
    this.roomPings = new RoomPingsController(socket, roomsService, audioService, _eventsService);
  }

  private getEventSubscriptions(socket: Socketio): TeardownLogic[] {
    const events = this.socketEvents;

    const subscriptions: TeardownLogic[] = [
      socket.on(events.connect).subscribe(() => {
        this._eventsService.publish({
          source: this.constructor.name,
          type: events.connect
        });
      }),

      socket.on(events.disconnect).subscribe(() => {
        this._eventsService.publish({
          source: this.constructor.name,
          type: events.disconnect
        });
      }),

      socket.on(events.connectError.replace('-', '_')).subscribe((event: any) => {
        this._eventsService.publish({
          source: this.constructor.name,
          type: events.connectError,
          data: event,
          severity: "error"
        });

        this.tryReconnect();
      }),

      socket.on<User>(events.userJoin).subscribe((user: User) => {
        this.updateUser(user);

        this._eventsService.publish({
          source: this.constructor.name,
          type: events.userJoin,
          data: user
        });
      }),

      socket.on<User>(events.userLeave).subscribe((user: User) => {
        this.updateUser(user);

        this._eventsService.publish({
          source: this.constructor.name,
          type: events.userLeave,
          data: user
        });
      })
    ];

    return subscriptions;
  }

  public loadUsers(organizationId: number): Promise<PagedList<User>> {
    return new Promise<PagedList<User>>(async (resolve, reject) => {
      try {
        const response: HttpResponse<PagedList<User>> = await this._usersService.getAllUsers({ organizationId }).toPromise();
        this._users = response.body;

        resolve(this._users);
      }
      catch(error) {
        reject(error);
      }
    });
  }

  public connect(clientUser: User): Promise<void> {
    return new Promise((resolve, reject) => {
      if(!clientUser) {
        reject("[clientUser] cannot be null");
      }

      let interval: number;
      let attempts: number = 1;

      const tryConnect = () => {
        this._socket.connect();

        if(this.isConnected) {
          window.clearInterval(interval);
          this.joinClientUser(clientUser);

          resolve();
        }
        else if(attempts >= 10) {
          window.clearInterval(interval);

          const event: Event<Error> = {
            source: this.constructor.name,
            type: this.socketEvents.connectError,
            data: new Error(`Max connection attempts reached: (${attempts})`),
            severity: "error"
          };

          this._eventsService.publish(event);
          reject(event.data);
        }
      };

      interval = window.setInterval(() => {
        attempts++;
        tryConnect();
      }, 500);

      tryConnect();
    });
  }

  public async tryReconnect(): Promise<void> {
    if(this._clientUser != null) {
      await this.connect(this._clientUser);
    }
  }

  private joinClientUser(clientUser: User): void {
    this._socket.emit(this.socketEvents.userJoin, clientUser, (response: User) => {
      this._clientUser = response;
      const index: number = this.findUserIndex(this._clientUser.id);

      if(index === -1) {
        this.addUser(this._clientUser);
      }
      else {
        this.updateUser(this._clientUser);
      }
    });
  }

  public disconnect(): void {
    this._socket.disconnect();
  }

  public findUserIndex(userId: number): number {
    return this._users?.data.findIndex((u: User) => u.id === userId) ?? -1;
  }

  public dispose(): void {
    this._users = null;
    this._clientUser = null;

    this._subscription?.unsubscribe();
    this._subscription = null;

    this.chat.dispose();
    this.roomPings.dispose();
  }

  private addUser(user: User): void {
    if(this._users == null) {
      this._users = { data: [user], pagination: null };
    }
    else {
      this._users.data.push(user);
    }
  }

  private updateUser(user: User): void {
    const index: number = this._users?.data.findIndex((u: User) => u.id === user.id);

    if(index !== -1) {
      this._users.data[index] = user;
    }
  }

  public get socketEvents() {
    return {
      connect: "connect",
      disconnect: "disconnect",
      connectError: "connect-error",
      userJoin: "user-join",
      userLeave: "user-leave",
    }
  }

  public get isConnected(): boolean {
    return this._socket.connected;
  }

  public get users(): PagedList<User> {
    return this._users;
  }
}