import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, defer, merge, Observable, of, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { AudioSound } from 'src/app/shared/models/audio-sound';
import { EventsService } from 'src/app/shared/modules/events/events.service';
import { ChatMessage } from '../../models/messages/chat-message';
import { ChatMessagesService } from '../api/chat-messages.service';
import { AudioService } from '../audio/audio.service';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public readonly disposed$: Observable<void> =
    this._socketService.disposed$.pipe(
      tap(() => {
        this._messageCreated$.complete();
        this._messageUpdated$.complete();
        this._messageDeleted$.complete();
        this._messages$.complete();
        this._newMessages$.complete();
      })
    );

  private readonly _messageCreated$ = new Subject<ChatMessage>();
  private readonly _messageUpdated$ = new Subject<ChatMessage>();
  private readonly _messageDeleted$ = new Subject<ChatMessage>();
  private readonly _messages$ = new BehaviorSubject<ChatMessage[]>([]);
  private readonly _newMessages$ = new BehaviorSubject<ChatMessage[]>([]);

  constructor(
    private _socketService: WebSocketService,
    private _messagesService: ChatMessagesService,
    private _audioService: AudioService,
    private _eventsService: EventsService
  ) {
    this.subscribeEvents();
  }

  private subscribeEvents(): void {
    merge(
      this._socketService.on(this.socketEvents.message).pipe(
        tap((value: ChatMessage) => {
          this.addMessage(value);
          this._audioService.play(AudioSound.ChatNotification);

          this._eventsService.publish({
            source: this.constructor.name,
            type: this.socketEvents.message,
            data: value,
          });

          this._messageCreated$.next(value);
          this._newMessages$.next([...this._newMessages$.value, value]);
        })
      ),

      this._socketService.on(this.socketEvents.messageEdit).pipe(
        tap((value: ChatMessage) => {
          this.updateMessage(value);
          this._eventsService.publish({
            source: this.constructor.name,
            type: this.socketEvents.messageEdit,
            data: value,
          });

          this._messageUpdated$.next(value);
        })
      ),

      this._socketService.on(this.socketEvents.messageDelete).pipe(
        tap((value: ChatMessage) => {
          this.deleteMessage(value);
          this._eventsService.publish({
            source: this.constructor.name,
            type: this.socketEvents.messageDelete,
            data: value,
          });

          this._messageDeleted$.next(value);
        })
      )
    )
      .pipe(takeUntil(this.disposed$))
      .subscribe();
  }

  public loadMessages(
    organizationId: number,
    beforeDate: Date,
    take?: number,
    concat?: boolean
  ): Observable<ChatMessage[]> {
    return this._messagesService
      .getAllMessagesBeforeDate({
        organizationId,
        datePosted: beforeDate.toISOString(),
        take,
        include: 'senderUser',
      })
      .pipe(
        map((response: HttpResponse<ChatMessage[]>) => response.body),
        tap((messages: ChatMessage[]) => {
          if (concat) {
            this.concatMessages(messages);
          } else {
            this._messages$.next(messages);
          }
        })
      );
  }

  public sendMessage(message: ChatMessage): Observable<ChatMessage> {
    if (!message) {
      return of(message);
    }

    return defer((): Observable<ChatMessage> => {
      this.addMessage(message);

      return this._socketService
        .emit<ChatMessage>(this.socketEvents.message, message)
        .pipe(tap((response: ChatMessage) => Object.assign(message, response)));
    });
  }

  public sendMessageEdit(message: ChatMessage): Observable<ChatMessage> {
    if (!message) {
      return of(message);
    }

    return defer((): Observable<ChatMessage> => {
      this.updateMessage(message);

      return this._socketService
        .emit<ChatMessage>(this.socketEvents.messageEdit, message)
        .pipe(tap((response: ChatMessage) => Object.assign(message, response)));
    });
  }

  public sendMessageDelete(message: ChatMessage): Observable<void> {
    if (!message) {
      return of(null);
    }

    return defer((): Observable<void> => {
      return this._socketService
        .emit<void>(this.socketEvents.messageDelete, message)
        .pipe(tap(() => this.deleteMessage(message)));
    });
  }

  public clearNewMessages(): void {
    this._newMessages$.next([]);
  }

  private concatMessages(messages: ChatMessage[]): void {
    const appended: ChatMessage[] = messages.filter(
      (c: ChatMessage) => !this.findMessage(c.id)
    );

    const result: ChatMessage[] = this._messages$.value.concat(appended);
    this._messages$.next(result);
  }

  private addMessage(message: ChatMessage): void {
    if (!this.findMessage(message.id)) {
      this._messages$.value.unshift(message);
      this._messages$.next(this._messages$.value);
    }
  }

  private updateMessage(message: ChatMessage): void {
    const index: number = this.findMessageIndex(message);

    if (index !== -1) {
      this._messages$.value[index] = message;
      this._messages$.next(this._messages$.value);
    }
  }

  private deleteMessage(message: ChatMessage): void {
    const index: number = this.findMessageIndex(message);

    if (index !== -1) {
      this._messages$.value.splice(index, 1);
      this._messages$.next(this._messages$.value);
    }
  }

  private findMessage(id: number): ChatMessage | undefined {
    return this._messages$.value.find((c: ChatMessage) => c.id === id);
  }

  private findMessageIndex(message: ChatMessage): number {
    return this._messages$.value.findIndex(
      (c: ChatMessage) => c.id === message.id
    );
  }

  public get socketEvents() {
    return {
      message: 'message',
      messageEdit: 'message-edit',
      messageDelete: 'message-delete',
    };
  }

  public get messageCreated$(): Observable<ChatMessage> {
    return this._messageCreated$.asObservable();
  }

  public get messageUpdated$(): Observable<ChatMessage> {
    return this._messageUpdated$.asObservable();
  }

  public get messageDeleted$(): Observable<ChatMessage> {
    return this._messageDeleted$.asObservable();
  }

  public get messages$(): Observable<ChatMessage[]> {
    return this._messages$.asObservable();
  }

  public get newMessages$(): Observable<ChatMessage[]> {
    return this._newMessages$.asObservable();
  }

  public get newMessagesCount$(): Observable<number> {
    return this._newMessages$.pipe(map((value: ChatMessage[]) => value.length));
  }
}
