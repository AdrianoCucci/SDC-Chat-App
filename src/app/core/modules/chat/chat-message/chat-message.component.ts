import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { ChatMessage } from 'src/app/core/models/messages/chat-message';
import { User } from 'src/app/core/models/users/user';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit {
  @Output() public readonly onEdit = new EventEmitter<ChatMessage>();
  @Output() public readonly onDelete = new EventEmitter<DeleteEventArgs>();

  @Input() public clientUser: User;
  @HostBinding("class.editing") public editingActive: boolean = false;

  private _message: ChatMessage;
  private _displayContents: string;

  ngOnInit(): void {
    this._displayContents = this.parseMessageContents(this._message?.contents);
  }

  private parseMessageContents(contents: string): string {
    if(contents) {
      contents = contents.replace(/\n/g, '<br/>');
    }

    return contents;
  }

  onSaveEdit(contents: string): void {
    if(contents && (this._message?.contents !== contents ?? false)) {
      this._message.contents = contents;
      this._displayContents = this.parseMessageContents(this._message.contents);

      this.onEdit.emit(this._message);
    }

    this.editingActive = false;
  }

  onDeleteClick(event: MouseEvent): void {
    this.onDelete.emit({ clickEvent: event, message: this._message });
  }

  public get message(): ChatMessage {
    return this._message;
  }
  @Input() public set message(value: ChatMessage) {
    this._message = value;
    this._displayContents = this.parseMessageContents(this._message?.contents);
  }

  public get sender(): User {
    return this._message.senderUser;
  }

  public get senderName(): string {
    let name: string;
    const sender: User = this.sender;

    if(sender != null) {
      name = sender.displayName ?? sender.username;
    }
    else {
      name = "User";
    }

    return name;
  }

  public get displayContents(): string {
    return this._displayContents;
  }

  @HostBinding("class.client-message") public get isClientMessage(): boolean {
    return this.sender?.id === this.clientUser?.id ?? false;
  }
}

export interface DeleteEventArgs {
  message: ChatMessage;
  clickEvent: MouseEvent;
}