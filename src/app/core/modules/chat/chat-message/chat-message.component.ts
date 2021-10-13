import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { ChatMessage } from 'src/app/core/models/messages/chat-message';
import { User } from 'src/app/core/models/users/user';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit {
  @Input() public clientUser: User;

  private _message: ChatMessage;
  private _messageContents: string;

  ngOnInit(): void {
    this._messageContents = this.parseMessageContents(this._message?.contents);
  }

  private parseMessageContents(contents: string): string {
    if(contents) {
      contents = contents.replace(/\n/g, '<br/>');
    }

    return contents;
  }

  public get message(): ChatMessage {
    return this._message;
  }
  @Input() public set message(value: ChatMessage) {
    this._message = value;
    this._messageContents = this.parseMessageContents(this._message?.contents);
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

  public get messageContents(): string {
    return this._messageContents;
  }

  @HostBinding("class.client-message") public get isClientMessage(): boolean {
    return this.sender?.id === this.clientUser?.id ?? false;
  }
}
