import { Component } from '@angular/core';
import { ChatMessage } from 'src/app/core/models/messages/chat-message';
import { User } from 'src/app/core/models/users/user';
import { ChatMessageListComponent } from 'src/app/core/modules/chat/chat-message-list/chat-message-list.component';
import { LoginService } from 'src/app/core/services/login.service';
import { WebSocketService } from 'src/app/core/services/web-socket/web-socket.service';
import { PagedList } from 'src/app/shared/models/pagination/paged-list';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPage {
  private _isLoadingMessages: boolean = false;

  constructor(private _socketService: WebSocketService, private _loginService: LoginService) { }

  async onLoadMoreMessages(list: ChatMessageListComponent): Promise<void> {
    if(!this._isLoadingMessages) {
      this._isLoadingMessages = true;

      try {
        const lastMessage: ChatMessage = list.messages[list.messages.length - 1];
        const beforeDate = new Date(lastMessage.datePosted);
        beforeDate.setMilliseconds(beforeDate.getMilliseconds() - 1);

        await this._socketService.chat.loadMessages(this.clientUser.organizationId, beforeDate, 50, true);
      }
      catch(error) {
        console.error("ERROR:", error);
      }
      finally {
        this._isLoadingMessages = false;
      }
    }
  }

  onAddMessage(message: ChatMessage): void {
    const clientUser: User = this.clientUser;

    message.senderUserId = clientUser.id;
    message.organizationId = clientUser.organizationId;
    message.senderUser = clientUser;

    this._socketService.chat.sendMessage(message);
  }

  onEditMessage(message: ChatMessage): void {
    this._socketService.chat.sendMessageEdit(message);
  }

  onDeleteMessage(message: ChatMessage): void {
    this._socketService.chat.sendMessageDelete(message);
  }

  public get messages(): ChatMessage[] {
    return this._socketService.chat.messages;
  }

  public get isLoadingMessages(): boolean {
    return this._isLoadingMessages;
  }

  public get users(): PagedList<User> {
    return this._socketService.users;
  }

  public get clientUser(): User {
    return this._loginService.user;
  }
}