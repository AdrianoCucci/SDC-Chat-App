import { HttpResponse } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { AudioSound } from 'src/app/shared/models/audio-sound';
import { ChatMessage } from '../../models/messages/chat-message';
import { ChatMessagesService } from '../api/chat-messages.service';
import { AudioService } from '../audio/audio.service';

export class ChatController {
  public readonly onMessage = new EventEmitter<ChatMessage>();

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

  private initializeEvents(socket: Socket): void {
    const events = this.events;

    socket.on(events.message, (message: ChatMessage) => {
      this.addMessage(message);
      this.onMessage.emit(message);

      this._audioService.play(AudioSound.ChatNotification);
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
      this._socket.emit(this.events.message, message);
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

  public get events() {
    return { message: "message" };
  }

  public get messages(): ChatMessage[] {
    return this._messages;
  }
}
