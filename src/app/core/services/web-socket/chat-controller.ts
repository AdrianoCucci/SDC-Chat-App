import { HttpResponse } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { Socketio } from "ngx-socketio2";
import { Subscription, TeardownLogic } from 'rxjs';
import { IDisposable } from 'src/app/shared/interfaces/i-disposable';
import { AudioSound } from 'src/app/shared/models/audio-sound';
import { subscribeMany } from 'src/app/shared/util/rxjs-utils';
import { ChatMessage } from '../../models/messages/chat-message';
import { ChatMessagesService } from '../api/chat-messages.service';
import { AudioService } from '../audio/audio.service';

export class ChatController implements IDisposable {
  public readonly onMessage = new EventEmitter<ChatMessage>();
  public readonly onMessageEdit = new EventEmitter<ChatMessage>();
  public readonly onMessageDelete = new EventEmitter<ChatMessage>();

  private readonly _socket: Socketio;
  private readonly _messagesService: ChatMessagesService;
  private readonly _audioService: AudioService;

  private _subscription: Subscription;
  private _messages: ChatMessage[];

  constructor(socket: Socketio, messagesService: ChatMessagesService, audioService: AudioService) {
    this._socket = socket;
    this._messagesService = messagesService;
    this._audioService = audioService;

    this._subscription = subscribeMany(this.getEventSubscriptions(this._socket));
  }

  public dispose(): void {
    this._subscription?.unsubscribe();
    this._subscription = null;
    this._messages = null;
  }

  private getEventSubscriptions(socket: Socketio): TeardownLogic[] {
    const events = this.events;

    const subscriptions: TeardownLogic[] = [
      socket.on<ChatMessage>(events.message).subscribe((message: ChatMessage) => {
        this.addMessage(message);
        this.onMessage.emit(message);
        this._audioService.play(AudioSound.ChatNotification);
      }),

      socket.on<ChatMessage>(events.messageEdit).subscribe((message: ChatMessage) => {
        this.onMessageEdit.emit(message);
        this.updateMessage(message);
      }),

      socket.on<ChatMessage>(events.messageDelete).subscribe((message: ChatMessage) => {
        this.onMessageDelete.emit(message);
        this.deleteMessage(message);
      })
    ];

    return subscriptions;
  }

  public loadMessages(organizationId: number, beforeDate: Date, take?: number, concat?: boolean): Promise<ChatMessage[]> {
    return new Promise<ChatMessage[]>(async (resolve, reject) => {
      try {
        const response: HttpResponse<ChatMessage[]> = await this._messagesService.getAllMessagesBeforeDate({
          organizationId,
          datePosted: beforeDate.toISOString(),
          take,
          include: "senderUser"
        }).toPromise();

        if(concat) {
          this.concatMessages(response.body);
        }
        else {
          this._messages = response.body;
        }

        resolve(this._messages);
      }
      catch(error) {
        reject(error);
      }
    });
  }

  public sendMessage(message: ChatMessage): void {
    if(message != null) {
      this._socket.emit(this.events.message, message);
      this.addMessage(message);
    }
  }

  public sendMessageEdit(message: ChatMessage): void {
    if(message != null) {
      this._socket.emit(this.events.messageEdit, message);
      this.updateMessage(message);
    }
  }

  public sendMessageDelete(message: ChatMessage): void {
    if(message != null) {
      this._socket.emit(this.events.messageDelete, message);
      this.deleteMessage(message);
    }
  }

  private concatMessages(messages: ChatMessage[]): void {
    if(this._messages == null) {
      this._messages = messages;
    }
    else {
      const appended: ChatMessage[] = [];

      for(let i = 0; i < messages.length; i++) {
        const message: ChatMessage = messages[i];

        if(this._messages.findIndex((m: ChatMessage) => m.id === message.id) === -1) {
          appended.push(message);
        }
      }

      this._messages = this._messages.concat(appended);
    }
  }

  private addMessage(message: ChatMessage): void {
    if(this._messages == null) {
      this._messages = [message];
    }
    else {
      this._messages.unshift(message);
    }
  }

  private updateMessage(message: ChatMessage): void {
    const index: number = this.findMessageIndex(message);

    if(index !== -1) {
      this._messages[index] = message;
    }
  }

  private deleteMessage(message: ChatMessage): void {
    const index: number = this.findMessageIndex(message);

    if(index !== -1) {
      this._messages.splice(index, 1);
    }
  }

  private findMessageIndex(message: ChatMessage): number {
    return this._messages?.findIndex((c: ChatMessage) => c.id === message.id) ?? -1;
  }

  public get events() {
    return {
      message: "message",
      messageEdit: "message-edit",
      messageDelete: "message-delete"
    };
  }

  public get messages(): ChatMessage[] {
    return this._messages;
  }
}
