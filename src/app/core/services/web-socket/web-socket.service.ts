import { EventEmitter, Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { User } from "../../models/users/user";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  public readonly onConnect = new EventEmitter<void>();
  public readonly onDisconnect = new EventEmitter<void>();
  public readonly onConnectError = new EventEmitter<any>();
  public readonly onUserJoin = new EventEmitter<User>();
  public readonly onUserLeave = new EventEmitter<User>();

  protected readonly _socket: Socket;

  constructor(socket: Socket) {
    this._socket = socket;

    if(this._socket == null) {
      throw new Error("[WebSocketService] > [Socket] dependency is null");
    }

    this.initializeEvents(socket);
  }

  protected initializeEvents(socket: Socket): void {
    const events = this.socketEvents;

    socket.on(events.connect, () => this.onConnect.emit());
    socket.on(events.disconnect, () =>  this.onDisconnect.emit());
    socket.on(events.connectError, (event: any) => this.onConnectError.emit(event));
    socket.on(events.userJoin, (user: User) => this.onUserJoin.emit(user));
    socket.on(events.userLeave, (user: User) => this.onUserLeave.emit(user));
  }

  public connect(): void {
    this._socket.connect();
  }

  public disconnect(): void {
    this._socket.disconnect();
  }

  public joinUser(user: User): void {
    if(user != null) {
      this._socket.emit(this.socketEvents.userJoin, user);
    }
  }

  public leaveUser(user: User): void {
    if(user != null) {
      this._socket.emit(this.socketEvents.userLeave, user);
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
}