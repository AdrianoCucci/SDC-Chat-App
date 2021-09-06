import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatMessage } from 'src/app/core/models/messages/chat-message';
import { User } from 'src/app/core/models/user';
import { ChatService } from 'src/app/core/services/chat.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit, OnDestroy {
  @Input() public clientUser: User;
  @Input() public messages: ChatMessage[];

  private _chatSubscription: Subscription;

  constructor(private _chatService: ChatService) { }

  ngOnInit(): void {
    this._chatSubscription = new Subscription();

    this._chatSubscription.add(this._chatService.onUserJoin.subscribe((user: User) => this.onUserJoin(user)));
    this._chatSubscription.add(this._chatService.onUserLeave.subscribe((user: User) => this.onUserLeave(user)));
    this._chatSubscription.add(this._chatService.onMessage.subscribe((message: ChatMessage) => this.appendMessage(message)));

    if(this.clientUser != null) {
      this._chatService.joinUser(this.clientUser);
    }
  }

  ngOnDestroy(): void {
    if(this.clientUser != null) {
      this._chatService.leaveUser(this.clientUser);
    }

    this._chatSubscription?.unsubscribe();
    this._chatSubscription = null;
  }

  private onUserJoin(user: User): void {
    console.log("USER JOINED:", user);
  }

  private onUserLeave(user: User): void {
    console.log("USER LEFT:", user);
  }

  onAddMessage(message: ChatMessage) {
    message.senderUserId = this.clientUser.userId;
    message.sender = this.clientUser;

    this.appendMessage(message);
    this._chatService.sendMessage(message);
  }

  private appendMessage(message: ChatMessage): void {
    if(this.messages == null) {
      this.messages = [message];
    }
    else {
      this.messages.push(message);
    }
  } 

  public get hasMessages(): boolean {
    return this.messages?.length > 0 ?? false;
  }
}
