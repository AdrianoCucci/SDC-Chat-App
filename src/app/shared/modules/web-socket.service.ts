import { EventEmitter, Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";

@Injectable()
export class WebSocketService {
  private static _errorCallback: Function;

  public readonly onConnect = new EventEmitter<void>();
  public readonly onDisconnect = new EventEmitter<void>();
  public readonly onConnectError = new EventEmitter<any>();

  protected readonly _socket: Socket;

  constructor(socket: Socket) {
    this._socket = socket;

    if(this._socket == null) {
      throw new Error("[WebSocketService] > [Socket] dependency is null");
    }

    if(WebSocketService._errorCallback == null) {
      WebSocketService._errorCallback = (error: any) => this.onConnectError.emit(error);
      this._socket.on("connect_error", WebSocketService._errorCallback);
    }
  }

  public connect(): void {
    if(!this.isConnected) {
      this._socket.connect();
    }
  }

  public disconnect(): void {
    if(this.isConnected) {
      this._socket.disconnect();
    }
  }

  public get isConnected(): boolean {
    return this._socket.ioSocket.connected;
  }
}