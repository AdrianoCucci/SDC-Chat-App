import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ChatMessage } from '../../models/messages/chat-message';
import { User } from '../../models/users/user';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService extends WebSocketService {
  public readonly onUserJoin = new EventEmitter<User>();
  public readonly onUserLeave = new EventEmitter<User>();
  public readonly onMessage = new EventEmitter<ChatMessage>();

  constructor(socket: Socket) {
    super(socket);
  }

  protected initializeEvents(socket: Socket): void {
    super.initializeEvents(socket);

    const events = this.chatEvents;

    socket.on(events.userJoin, (user: User) => this.onUserJoin.emit(user));
    socket.on(events.userLeave, (user: User) => this.onUserLeave.emit(user));
    socket.on(events.message, (message: ChatMessage) => this.onMessage.emit(message));
  }

  public joinUser(user: User): void {
    if(user != null) {
      this._socket.emit(this.chatEvents.userJoin, user);
    }
  }

  public leaveUser(user: User): void {
    if(user != null) {
      this._socket.emit(this.chatEvents.userLeave, user);
    }
  }

  public sendMessage(message: ChatMessage): void {
    if(message != null) {
      this._socket.emit(this.chatEvents.message, message);
    }
  }

  public get chatEvents() {
    return {
      userJoin: "user-join",
      userLeave: "user-leave",
      message: "message"
    }
  }
}
