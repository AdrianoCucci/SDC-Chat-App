import { Component, Input } from '@angular/core';
import { ChatMessage } from 'src/app/core/models/messages/chat-message';
import { User } from 'src/app/core/models/users/user';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent {
  @Input() public message: ChatMessage;

  public get sender(): User {
    return this.message.sender;
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
    let contents: string = null;

    if(this.message != null) {
      contents = this.message.contents.replace(/\n/g, '<br/>');
    }

    return contents;
  }
}
