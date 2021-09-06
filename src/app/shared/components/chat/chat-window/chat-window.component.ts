import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Message } from 'src/app/core/models/messages/message';
import { User } from 'src/app/core/models/user';
import { ChatService } from 'src/app/core/services/chat.service';
import { InputTextarea } from '../../forms/inputs/input-textarea/input-textarea.component';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() public clientUser: User;
  @Input() public messages: Message[];

  @ViewChild("messagesList") private readonly _messagesListRef: ElementRef;

  private _chatSubscription: Subscription;

  constructor(private _chatService: ChatService) { }

  ngOnInit(): void {
    this._chatSubscription = new Subscription();

    this._chatSubscription.add(this._chatService.onUserJoin.subscribe((user: User) => this.onUserJoin(user)));
    this._chatSubscription.add(this._chatService.onUserLeave.subscribe((user: User) => this.onUserLeave(user)));
    this._chatSubscription.add(this._chatService.onMessage.subscribe((message: Message) => this.appendMessage(message)));

    if(this.clientUser != null) {
      this._chatService.joinUser(this.clientUser);
    }
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
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

  onSendMessage(textArea: InputTextarea): void {
    const value: string = textArea.value.trim();

    if(value) {
      this.sendMessage(value);
    }

    setTimeout(() => {
      textArea.clear();
      textArea.focus();

      if(value) {
        this.scrollToBottom();
      }
    });
  }

  private sendMessage(text: string): void {
    const message: Message = {
      contents: text,
      datePosted: new Date(),
      senderUserId: 1,
      sender: this.clientUser
    };

    this.appendMessage(message);
    this._chatService.sendMessage(message);
  }

  private appendMessage(message: Message): void {
    if(this.messages == null) {
      this.messages = [message];
    }
    else {
      this.messages.push(message);
    }
  }

  public scrollToBottom() {
    if(this._messagesListRef != null) {
      const list: HTMLElement = this._messagesListRef.nativeElement;

      list.scrollTo({
        top: list.scrollHeight,
        behavior: "smooth"
      });
    }
  }

  public get hasMessages(): boolean {
    return this.messages?.length > 0 ?? false;
  }
}
