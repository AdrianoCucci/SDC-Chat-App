import { Component, HostListener, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Keywords } from 'src/app/core/models/chat/keywords';
import { ChatMessage } from 'src/app/core/models/messages/chat-message';
import { User } from 'src/app/core/models/users/user';
import { ChatMessageListComponent } from 'src/app/core/modules/chat/chat-message-list/chat-message-list.component';
import { LoginService } from 'src/app/core/services/login.service';
import { ChatService } from 'src/app/core/services/web-socket/chat.service';
import { SocketUsersService } from 'src/app/core/services/web-socket/socket-users.service';
import { PagedList } from 'src/app/shared/models/pagination/paged-list';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss'],
})
export class ChatPage implements OnInit {
  public readonly users$: Observable<User[]>;
  public readonly messages$: Observable<ChatMessage[]>;

  public readonly keywords: Keywords = { values: [], prefix: '@' };

  private _isLoadingMessages: boolean = false;

  constructor(
    private _chatService: ChatService,
    private _socketUsersService: SocketUsersService,
    private _loginService: LoginService
  ) {
    this.users$ = this._socketUsersService.users$.pipe(
      map((value: PagedList<User>) => value.data),
      tap(
        (value: User[]) =>
          (this.keywords.values = value.map(
            (u: User) => u.displayName || u.username
          ))
      )
    );

    this.messages$ = this._chatService.messages$;
  }

  ngOnInit(): void {
    this.onUserInteraction();
  }

  onLoadMoreMessages(list: ChatMessageListComponent): void {
    if (this._isLoadingMessages) {
      return;
    }

    this._isLoadingMessages = true;

    const lastMessage: ChatMessage = list.messages[list.messages.length - 1];

    const beforeDate = new Date(lastMessage.datePosted);
    beforeDate.setMilliseconds(beforeDate.getMilliseconds() - 1);

    this._chatService
      .loadMessages(this.clientUser.organizationId, beforeDate, 50, true)
      .subscribe(() => (this._isLoadingMessages = false));
  }

  onAddMessage(message: ChatMessage): void {
    const clientUser: User = this.clientUser;

    message.senderUserId = clientUser.id;
    message.organizationId = clientUser.organizationId;
    message.senderUser = clientUser;

    this._chatService.sendMessage(message).subscribe();
  }

  onEditMessage(message: ChatMessage): void {
    this._chatService.sendMessageEdit(message).subscribe();
  }

  onDeleteMessage(message: ChatMessage): void {
    this._chatService.sendMessageDelete(message).subscribe();
  }

  @HostListener('click')
  @HostListener('keydown')
  private onUserInteraction(): void {
    this._chatService.clearNewMessages();
  }

  public get isLoadingMessages(): boolean {
    return this._isLoadingMessages;
  }

  public get clientUser(): User {
    return this._loginService.user;
  }
}
