import { Component, Input } from '@angular/core';
import { ChatMessage } from 'src/app/core/models/messages/chat-message';
import { User } from 'src/app/core/models/users/user';
import { ChatService } from 'src/app/core/services/web-socket/chat.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent {
  @Input() public clientUser: User;

  constructor(private _chatService: ChatService) { }

  onAddMessage(message: ChatMessage): void {
    message.senderUserId = this.clientUser.id;
    message.organizationId = this.clientUser.organizationId;
    message.senderUser = this.clientUser;

    this._chatService.sendMessage(message);
  }

  public get messages(): ChatMessage[] {
    return this._chatService.messages;
  }

  public get hasMessages(): boolean {
    return this.messages?.length > 0 ?? false;
  }

  public get users(): User[] {
    return this._chatService.users;
  }
}
