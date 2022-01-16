import { Component } from '@angular/core';
import { ChatMessage } from 'src/app/core/models/messages/chat-message';
import { User } from 'src/app/core/models/users/user';
import { LoginService } from 'src/app/core/services/login.service';
import { WebSocketService } from 'src/app/core/services/web-socket/web-socket.service';
import { PagedList } from 'src/app/shared/models/pagination/paged-list';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPage {
  constructor(private _socketService: WebSocketService, private _loginService: LoginService) { }

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

  public get users(): PagedList<User> {
    return this._socketService.users;
  }

  public get clientUser(): User {
    return this._loginService.user;
  }
}