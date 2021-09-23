import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ChatMessage } from '../../models/messages/chat-message';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService extends WebSocketService {
  public readonly onMessage = new EventEmitter<ChatMessage>();

  constructor(socket: Socket) {
    super(socket);
  }

  protected initializeEvents(socket: Socket): void {
    super.initializeEvents(socket);

    const events = this.chatEvents;
    socket.on(events.message, (message: ChatMessage) => this.onMessage.emit(message));
  }

  public sendMessage(message: ChatMessage): void {
    if(message != null) {
      this._socket.emit(this.chatEvents.message, message);
    }
  }

  public get chatEvents() {
    return { message: "message" };
  }
}
