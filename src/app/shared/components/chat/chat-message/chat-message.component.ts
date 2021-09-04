import { Component, Input } from '@angular/core';
import { Message } from 'src/app/core/models/messages/message';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent {
  @Input() public message: Message;

  public get sender(): User {
    return this.message.sender;
  }

  public get senderName(): string {
    return this.sender != null
      ? `${this.sender.firstName} ${this.sender.lastName}`.trim()
      : "User";
  }
}
