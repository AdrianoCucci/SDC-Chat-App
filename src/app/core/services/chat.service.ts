import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { Message } from '../models/messages/message';

@Injectable()
export class ChatService extends Socket {
  public readonly onMessage = new EventEmitter<Message>();

  private readonly _events = {
    message: "message"
  };

  constructor() {
    super({ url: environment.server.url });
    this.initialize();
  }

  private initialize(): void {
    this.on(this._events.message, (message: Message) => this.onMessage.emit(message));
  }

  public sendMessage(message: Message): void {
    this.emit(this._events.message, message);
  }
}
