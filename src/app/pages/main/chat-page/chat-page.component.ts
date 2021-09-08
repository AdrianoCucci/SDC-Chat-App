import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ChatMessage } from 'src/app/core/models/messages/chat-message';
import { User } from 'src/app/core/models/users/user';
import { ChatMessagesService } from 'src/app/core/services/api/chat-messages.service';
import { UsersService } from 'src/app/core/services/api/users-service';
import { LoginService } from 'src/app/core/services/login.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPage {
  public readonly loggedInUser: User;

  public users: User[];
  public messages: ChatMessage[];

  private _initialized: boolean = false;

  constructor(private _usersService: UsersService, private _messagesService: ChatMessagesService, loginService: LoginService) {
    this.loggedInUser = loginService.user;
  }

  async ngOnInit() {
    try {
      const data: [User[], ChatMessage[]] = await Promise.all([
        this.loadUsers(),
        this.loadMessages()
      ]);

      this.users = data[0];
      this.messages = data[1];

      this._initialized = true;
    }
    catch(error) {
      throw error;
    }
  }

  private loadUsers(): Promise<User[]> {
    return new Promise<User[]>(async (resolve, reject) => {
      try {
        const response: HttpResponse<User[]> = await this._usersService.getAllUsers().toPromise();
        resolve(response.body);
      }
      catch(error) {
        reject(error);
      }
    });
  }

  private loadMessages(): Promise<ChatMessage[]> {
    return new Promise<ChatMessage[]>(async (resolve, reject) => {
      try {
        const response: HttpResponse<ChatMessage[]> = await this._messagesService.getAllMessages().toPromise();
        resolve(response.body);
      }
      catch(error) {
        reject(error);
      }
    });
  }

  public get initialized(): boolean {
    return this._initialized;
  }
}