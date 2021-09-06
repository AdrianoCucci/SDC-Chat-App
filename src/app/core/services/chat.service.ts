import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { ChatMessage } from '../models/messages/chat-message';
import { User } from '../models/user';

@Injectable()
export class ChatService extends Socket {
  public readonly onUserJoin = new EventEmitter<User>();
  public readonly onUserLeave = new EventEmitter<User>();
  public readonly onMessage = new EventEmitter<ChatMessage>();

  private readonly _events = {
    userJoin: "user-join",
    userLeave: "user-leave",
    message: "message"
  };

  constructor() {
    super({ url: environment.server.url });
    this.initialize();
  }

  private initialize(): void {
    this.on(this._events.userJoin, (user: User) => this.onUserJoin.emit(user));
    this.on(this._events.userLeave, (user: User) => this.onUserLeave.emit(user));
    this.on(this._events.message, (message: ChatMessage) => this.onMessage.emit(message));
  }

  public joinUser(user: User): void {
    if(user!= null) {
      this.emit(this._events.userJoin, user);
    }
  }

  public leaveUser(user: User): void {
    if(user != null) {
      this.emit(this._events.userLeave, user);
    }
  }

  public sendMessage(message: ChatMessage): void {
    if(message != null) {
      this.emit(this._events.message, message);
    }
  }
}
