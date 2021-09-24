import { HttpResponse } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ChatMessage } from '../../models/messages/chat-message';
import { ChatMessagesService } from '../api/chat-messages.service';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService extends WebSocketService {
  public readonly onMessage = new EventEmitter<ChatMessage>();

  private _messages: ChatMessage[];

  constructor(socket: Socket, private _messagesService: ChatMessagesService) {
    super(socket);
  }

  protected initializeEvents(socket: Socket): void {
    super.initializeEvents(socket);

    const events = this.chatEvents;

    socket.on(events.message, (message: ChatMessage) => {
      this.addMessage(message);
      this.onMessage.emit(message);
    });
  }

  public loadMessages(organizationId: number): Promise<ChatMessage[]> {
    return new Promise<ChatMessage[]>(async (resolve, reject) => {
      try {
        const response: HttpResponse<ChatMessage[]> = await this._messagesService.getAllMessages({ organizationId }).toPromise();
        this._messages = response.body;

        resolve(this._messages);
      }
      catch(error) {
        reject(error);
      }
    });
  }

  public sendMessage(message: ChatMessage): void {
    if(message != null) {
      this._socket.emit(this.chatEvents.message, message);
      this.addMessage(message);
    }
  }

  private addMessage(message: ChatMessage): void {
    if(this._messages == null) {
      this._messages = [message];
    }
    else {
      this._messages.push(message);
    }
  }

  public get chatEvents() {
    return { message: "message" };
  }

  public get messages(): ChatMessage[] {
    return this._messages;
  }
}
