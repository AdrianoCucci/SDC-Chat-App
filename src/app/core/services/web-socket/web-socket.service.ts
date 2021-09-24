import { HttpResponse } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { User } from "../../models/users/user";
import { ChatMessagesService } from "../api/chat-messages.service";
import { RoomsService } from "../api/rooms-service";
import { UsersService } from "../api/users-service";
import { AudioService } from "../audio.service";
import { ChatController } from "./chat-controller";
import { RoomPingsController } from "./room-pings-controller";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  public readonly onConnect = new EventEmitter<void>();
  public readonly onDisconnect = new EventEmitter<void>();
  public readonly onConnectError = new EventEmitter<any>();
  public readonly onUserJoin = new EventEmitter<User>();
  public readonly onUserLeave = new EventEmitter<User>();

  public readonly chat: ChatController;
  public readonly roomPings: RoomPingsController;

  protected readonly _socket: Socket;

  private _users: User[];

  constructor(socket: Socket, private _usersService: UsersService, messagesService: ChatMessagesService, roomsService: RoomsService, audioService: AudioService) {
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

  public connect(user: User): void {
    if(user != null) {
      this._socket.connect();
      this._socket.emit(this.socketEvents.userJoin, user);
    }
  }

  public disconnect(): void {
    this._socket.disconnect();
    this._users = null;
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