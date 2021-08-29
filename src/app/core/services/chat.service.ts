import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

@Injectable()
export class ChatService extends Socket {
  public readonly onMessage = new EventEmitter<string>();

  private readonly _events = {
    message: "message"
  };

  constructor() {
    super({ url: environment.server.url });
    this.initialize();
  }

  private initialize(): void {
    this.on(this._events.message, (message: string) => this.onMessage.emit(message));
  }

  public sendMessage(message: string): void {
    this.emit(this._events.message, message);
  }
}
