import { Component } from '@angular/core';
import { ChatMessage } from 'src/app/core/models/messages/chat-message';
import { User } from 'src/app/core/models/users/user';
import { LoginService } from 'src/app/core/services/login.service';
import { WebSocketService } from 'src/app/core/services/web-socket/web-socket.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPage {
  private readonly _clientUser: User;

  constructor(private _socketService: WebSocketService, loginService: LoginService) {
    this._clientUser = loginService.user;
  }

  onAddMessage(message: ChatMessage): void {
    message.senderUserId = this._clientUser.id;
    message.organizationId = this._clientUser.organizationId;
    message.senderUser = this._clientUser;

    this._socketService.chat.sendMessage(message);
  }

  public get messages(): ChatMessage[] {
    return this._socketService.chat.messages;
  }

  public get users(): User[] {
    return this._socketService.users;
  }
}