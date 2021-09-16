import { EventEmitter, Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";

@Injectable()
export class WebSocketService {
  public readonly onConnect = new EventEmitter<void>();
  public readonly onDisconnect = new EventEmitter<void>();
  public readonly onConnectError = new EventEmitter<any>();

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
  }

  public connect(): void {
    this._socket.connect();
  }

  public disconnect(): void {
    this._socket.disconnect();
  }

  public get socketEvents() {
    return {
      connect: "connect",
      disconnect: "disconnect",
      connectError: "connect_error"
    }
  }

  public get isConnected(): boolean {
    return this._socket.ioSocket.connected;
  }
}