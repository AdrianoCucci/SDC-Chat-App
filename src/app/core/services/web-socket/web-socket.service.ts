import { HttpResponse } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { Subscription } from "rxjs";
import { IDisposable } from "src/app/shared/interfaces/i-disposable";
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
  public readonly onConnect = new EventEmitter<void>();
  public readonly onDisconnect = new EventEmitter<void>();
  public readonly onConnectError = new EventEmitter<any>();
  public readonly onUserJoin = new EventEmitter<User>();
  public readonly onUserLeave = new EventEmitter<User>();

  public readonly chat: ChatController;
  public readonly roomPings: RoomPingsController;

  protected readonly _socket: Socket;

  private _users: User[];
  private _clientUser: User;

  constructor(
    private _usersService: UsersService,
    socket: Socket,
    messagesService: ChatMessagesService,
    roomsService: RoomsService,
    audioService: AudioService
  ) {
    this._socket = socket;

    if(this._socket == null) {
      throw new Error("[WebSocketService] > [Socket] dependency is null");
    }

    this.initializeEvents(socket);

    this.chat = new ChatController(socket, messagesService, audioService);
    this.roomPings = new RoomPingsController(socket, roomsService, audioService);
  }

  protected initializeEvents(socket: Socket): void {
    const events = this.socketEvents;

    socket.on(events.connect, () => this.onConnect.emit());
    socket.on(events.disconnect, () => this.onDisconnect.emit());
    socket.on(events.connectError, (event: any) => this.onConnectError.emit(event));

    socket.on(events.userJoin, (user: User) => {
      this.updateUser(user);
      this.onUserJoin.emit(user);
    });

    socket.on(events.userLeave, (user: User) => {
      this.updateUser(user);
      this.onUserLeave.emit(user);
    });
  }

  public loadUsers(organizationId: number): Promise<User[]> {
    return new Promise<User[]>(async (resolve, reject) => {
      try {
        const response: HttpResponse<User[]> = await this._usersService.getAllUsers({ organizationId }).toPromise();
        this._users = response.body;

        resolve(this._users);
      }
      catch(error) {
        reject(error);
      }
    });
  }

  public connect(clientUser: User): void {
    if(clientUser != null) {
      this._socket.connect();

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
  }

  public tryConnect(clientUser: User): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(!clientUser) {
        reject("[clientUser] cannot be null");
      }

      const subscription = new Subscription();

      subscription.add(this.onConnect.subscribe(() => {
        subscription.unsubscribe();
        resolve();
      }));

      subscription.add(this.onConnectError.subscribe((error: any) => {
        subscription.unsubscribe();
        reject(error);
      }));

      this.connect(clientUser);
    });
  }

  public disconnect(): void {
    this._socket.disconnect();
  }

  public findUserIndex(userId: number): number {
    return this._users?.findIndex((u: User) => u.id === userId) ?? -1;
  }

  public dispose(): void {
    this._users = null;
    this._clientUser = null;
    this.chat.dispose();
    this.roomPings.dispose();
  }

  private addUser(user: User): void {
    if(this._users == null) {
      this._users = [user];
    }
    else {
      this._users.push(user);
    }
  }

  private updateUser(user: User): void {
    const index: number = this._users?.findIndex((u: User) => u.id === user.id);

    if(index !== -1) {
      this._users[index] = user;
    }
  }

  public get socketEvents() {
    return {
      connect: "connect",
      disconnect: "disconnect",
      connectError: "connect_error",
      userJoin: "user-join",
      userLeave: "user-leave",
    }
  }

  public get isConnected(): boolean {
    return this._socket.ioSocket.connected;
  }

  public get users(): User[] {
    return this._users;
  }
}