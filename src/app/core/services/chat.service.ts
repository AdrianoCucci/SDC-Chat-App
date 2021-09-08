import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ChatMessage } from '../models/messages/chat-message';
import { User } from '../models/user';

@Injectable()
export class ChatService {
  public readonly onUserJoin = new EventEmitter<User>();
  public readonly onUserLeave = new EventEmitter<User>();
  public readonly onMessage = new EventEmitter<ChatMessage>();

  private readonly _events = {
    userJoin: "user-join",
    userLeave: "user-leave",
    message: "message"
  };

  constructor(private _socket: Socket) {
    this.initializeEvents(_socket);
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
