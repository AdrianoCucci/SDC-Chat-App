import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDisposable } from 'src/app/shared/interfaces/i-disposable';
import { AudioSound } from 'src/app/shared/models/audio-sound';
import { EventsService } from 'src/app/shared/modules/events/events.service';
import { ChatMessage } from '../../models/messages/chat-message';
import { ChatMessagesService } from '../api/chat-messages.service';
import { AudioService } from '../audio/audio.service';
import { LoginService } from '../login.service';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService implements IDisposable {
  private _messages: ChatMessage[];

  constructor(
    private _socketService: WebSocketService,
    private _messagesService: ChatMessagesService,
    private _audioService: AudioService,
    private _eventsService: EventsService
  ) {
    this.subsribeEvents();
  }

  public dispose(): void {
    this._messages = null;
  }

  private subsribeEvents(): void {
    const socket: WebSocketService = this._socketService;
    const events = this.socketEvents;
    const eventsService: EventsService = this._eventsService;
    const eventsSource: string = this.constructor.name;

    socket.on<ChatMessage>(events.message, (message: ChatMessage) => {
      this.addMessage(message);
      this._audioService.play(AudioSound.ChatNotification);

      eventsService.publish({
        source: eventsSource,
        type: events.message,
        data: message,
      });
    });

    socket.on<ChatMessage>(events.messageEdit, (message: ChatMessage) => {
      this.updateMessage(message);

      eventsService.publish({
        source: eventsSource,
        type: events.messageEdit,
        data: message,
      });
    });

    socket.on<ChatMessage>(events.messageDelete, (message: ChatMessage) => {
      this.deleteMessage(message);

      eventsService.publish({
        source: eventsSource,
        type: events.messageDelete,
        data: message,
      });
    });

    eventsService.subscribe({
      eventSources: LoginService.name,
      eventTypes: 'logout',
      eventHandler: () => this.dispose(),
    });
  }

  public loadMessages(
    organizationId: number,
    beforeDate: Date,
    take?: number,
    concat?: boolean
  ): Promise<ChatMessage[]> {
    return new Promise<ChatMessage[]>(async (resolve, reject) => {
      try {
        const response: HttpResponse<ChatMessage[]> =
          await this._messagesService
            .getAllMessagesBeforeDate({
              organizationId,
              datePosted: beforeDate.toISOString(),
              take,
              include: 'senderUser',
            })
            .toPromise();

        if (concat) {
          this.concatMessages(response.body);
        } else {
          this._messages = response.body;
        }

        resolve(this._messages);
      } catch (error) {
        reject(error);
      }
    });
  }

  public sendMessage(message: ChatMessage): Promise<ChatMessage> {
    return new Promise((resolve) => {
      if (message == null) {
        resolve(null);
      }

      this.addMessage(message);

      this._socketService.emit(
        this.socketEvents.message,
        message,
        (response: ChatMessage) => {
          Object.assign(message, response);
          resolve(response);
        }
      );
    });
  }

  public sendMessageEdit(message: ChatMessage): Promise<ChatMessage> {
    return new Promise((resolve) => {
      if (message == null) {
        resolve(null);
      }

      this.updateMessage(message);

      this._socketService.emit(
        this.socketEvents.messageEdit,
        message,
        (response: ChatMessage) => {
          Object.assign(message, response);
          resolve(response);
        }
      );
    });
  }

  public sendMessageDelete(message: ChatMessage): void {
    if (message != null) {
      this._socketService.emit(this.socketEvents.messageDelete, message);
      this.deleteMessage(message);
    }
  }

  private concatMessages(messages: ChatMessage[]): void {
    if (this._messages == null) {
      this._messages = messages;
    } else {
      const appended: ChatMessage[] = [];

      for (let i = 0; i < messages.length; i++) {
        const message: ChatMessage = messages[i];

        if (
          this._messages.findIndex((m: ChatMessage) => m.id === message.id) ===
          -1
        ) {
          appended.push(message);
        }
      }

      this._messages = this._messages.concat(appended);
    }
  }

  private addMessage(message: ChatMessage): void {
    if (this._messages == null) {
      this._messages = [message];
    } else {
      this._messages.unshift(message);
    }
  }

  private updateMessage(message: ChatMessage): void {
    const index: number = this.findMessageIndex(message);

    if (index !== -1) {
      this._messages[index] = message;
    }
  }

  private deleteMessage(message: ChatMessage): void {
    const index: number = this.findMessageIndex(message);

    if (index !== -1) {
      this._messages.splice(index, 1);
    }
  }

  private findMessageIndex(message: ChatMessage): number {
    return (
      this._messages?.findIndex((c: ChatMessage) => c.id === message.id) ?? -1
    );
  }

  public get socketEvents() {
    return {
      message: 'message',
      messageEdit: 'message-edit',
      messageDelete: 'message-delete',
    };
  }

  public get messages(): ChatMessage[] {
    return this._messages;
  }
}
