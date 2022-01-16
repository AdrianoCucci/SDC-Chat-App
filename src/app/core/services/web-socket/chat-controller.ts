import { HttpResponse } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { IDisposable } from 'src/app/shared/interfaces/i-disposable';
import { AudioSound } from 'src/app/shared/models/audio-sound';
import { ChatMessage } from '../../models/messages/chat-message';
import { ChatMessagesService } from '../api/chat-messages.service';
import { AudioService } from '../audio/audio.service';

export class ChatController implements IDisposable {
  public readonly onMessage = new EventEmitter<ChatMessage>();
  public readonly onMessageEdit = new EventEmitter<ChatMessage>();
  public readonly onMessageDelete = new EventEmitter<ChatMessage>();

  private readonly _socket: Socket;
  private readonly _messagesService: ChatMessagesService;
  private readonly _audioService: AudioService;

  private _messages: ChatMessage[];

  constructor(socket: Socket, messagesService: ChatMessagesService, audioService: AudioService) {
    this._socket = socket;
    this._messagesService = messagesService;
    this._audioService = audioService;

    this.initializeEvents(this._socket);
  }

  public dispose(): void {
    this._messages = null;
  }

  private initializeEvents(socket: Socket): void {
    const events = this.events;

    socket.on(events.message, (message: ChatMessage) => {
      this.addMessage(message);
      this.onMessage.emit(message);

      this._audioService.play(AudioSound.ChatNotification);
    });

    socket.on(events.messageEdit, (message: ChatMessage) => {
      this.onMessageEdit.emit(message);
      this.updateMessage(message);
    });

    socket.on(events.messageDelete, (message: ChatMessage) => {
      this.onMessageDelete.emit(message);
      this.deleteMessage(message);
    });
  }

  public loadMessages(organizationId: number, beforeDate: Date, take?: number, concat?: boolean): Promise<ChatMessage[]> {
    return new Promise<ChatMessage[]>(async (resolve, reject) => {
      try {
        const response: HttpResponse<ChatMessage[]> = await this._messagesService.getAllMessagesBeforeDate({
          organizationId,
          datePosted: beforeDate.toISOString(),
          take
        }).toPromise();

        if(concat && this._messages != null) {
          this._messages = this._messages.concat(response.body);
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

  private addMessage(message: ChatMessage): void {
    if(this._messages == null) {
      this._messages = [message];
    }
    else {
      this._messages.push(message);
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
