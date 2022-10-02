import { DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Keywords } from 'src/app/core/models/chat/keywords';
import { ChatMessage } from 'src/app/core/models/messages/chat-message';
import { User } from 'src/app/core/models/users/user';
import { isToday } from 'src/app/shared/util/date-utils';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent implements OnInit {
  @Output() public readonly onEdit = new EventEmitter<ChatMessage>();
  @Output() public readonly onDelete = new EventEmitter<DeleteEventArgs>();

  @Input() public clientUser: User;
  @Input() public keywords?: Keywords;

  @HostBinding('class.editing') public editingActive: boolean = false;

  private _message: ChatMessage;
  private _displayContents: string;
  private _keywordsCount: number = 0;

  constructor(private _datePipe: DatePipe) {}

  ngOnInit(): void {
    this._displayContents = this.parseMessageContents(this._message?.contents);
  }

  private parseMessageContents(contents: string): string {
    if (!contents) {
      return contents;
    }

    contents = contents.replace(/\n/g, '<br/>');
    const parsedKeywordsContent: [string, number] =
      this.parseMessageKeywords(contents);

    this._keywordsCount = parsedKeywordsContent[1];
    return parsedKeywordsContent[0];
  }

  private parseMessageKeywords(contents: string): [string, number] {
    const keywords: string = this.keywords?.values
      .map((w: string) => `${this.keywords.prefix || ''}${w}`)
      .join('|');

    if (!keywords) {
      return [contents, 0];
    }

    const expression = new RegExp(keywords, 'g');
    let keywordsCount: number = 0;

    const result: string = contents.replace(expression, (keyword: string) => {
      keywordsCount++;
      return `<span class="keyword">${keyword}</span>`;
    });

    return [result, keywordsCount];
  }

  public getMessageDateFormat(message: ChatMessage): string {
    const datePosted = new Date(message.datePosted);

    return isToday(datePosted)
      ? `Today at: ${this._datePipe.transform(datePosted, 'h:mm a')}`
      : this._datePipe.transform(datePosted, 'dd/MM/yyyy');
  }

  onSaveEdit(contents: string): void {
    if (contents && (this._message?.contents !== contents ?? false)) {
      this._message.contents = contents;
      this._displayContents = this.parseMessageContents(this._message.contents);

      this.onEdit.emit(this._message);
    }

    this.editingActive = false;
  }

  onDeleteClick(event: MouseEvent): void {
    this.onDelete.emit({ clickEvent: event, message: this._message });
  }

  private getUserDisplayName(user: User): string {
    let name: string;

    if (user) {
      name = user.displayName ?? user.username;
    } else {
      name = 'User';
    }

    return name;
  }

  public get message(): ChatMessage {
    return this._message;
  }
  @Input() public set message(value: ChatMessage) {
    this._message = value;
    this._displayContents = this.parseMessageContents(this._message?.contents);
  }

  public get sender(): User {
    return this._message?.senderUser;
  }

  public get senderName(): string {
    return this.getUserDisplayName(this.sender);
  }

  public get clientName(): string {
    return this.getUserDisplayName(this.clientUser);
  }

  public get displayContents(): string {
    return this._displayContents;
  }

  @HostBinding('class.client-message') public get isClientMessage(): boolean {
    return this.message?.senderUserId === this.clientUser?.id ?? false;
  }

  @HostBinding('class.client-mention') public get isClientMentioned(): boolean {
    return this.message?.contents.includes(
      `${this.keywords?.prefix || ''}${this.clientName}`
    );
  }

  public get keywordsCount(): number {
    return this._keywordsCount;
  }

  public get hasKeywords(): boolean {
    return this._keywordsCount > 0;
  }
}

export interface DeleteEventArgs {
  message: ChatMessage;
  clickEvent: MouseEvent;
}
