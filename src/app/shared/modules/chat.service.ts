import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ChatMessage } from '../../core/models/messages/chat-message';
import { User } from '../../core/models/users/user';
import { WebSocketService } from './web-socket.service';

@Injectable()
export class ChatService extends WebSocketService {
  public readonly onUserJoin = new EventEmitter<User>();
  public readonly onUserLeave = new EventEmitter<User>();
  public readonly onMessage = new EventEmitter<ChatMessage>();

  private readonly _events = {
    userJoin: "user-join",
    userLeave: "user-leave",
    message: "message"
  };

  constructor(socket: Socket) {
    super(socket);
    this.initializeEvents(socket);
  }

  private initializeEvents(socket: Socket): void {
    socket.on(this._events.userJoin, (user: User) => this.onUserJoin.emit(user));
    socket.on(this._events.userLeave, (user: User) => this.onUserLeave.emit(user));
    socket.on(this._events.message, (message: ChatMessage) => this.onMessage.emit(message));
  }

  public joinUser(user: User): void {
    if(user!= null) {
      this._socket.emit(this._events.userJoin, user);
    }
  }

  public leaveUser(user: User): void {
    if(user != null) {
      this._socket.emit(this._events.userLeave, user);
    }
  }

  public sendMessage(message: ChatMessage): void {
    if(message != null) {
      this._socket.emit(this._events.message, message);
    }
  }
}
