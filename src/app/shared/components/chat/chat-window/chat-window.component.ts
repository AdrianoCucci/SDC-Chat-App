import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Message } from 'src/app/core/models/messages/message';
import { ChatService } from 'src/app/core/services/chat.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit, OnDestroy {
  @Input() public messages: Message[];

  private _chatSubscription: Subscription;

  constructor(private _chatService: ChatService) { }

  ngOnInit(): void {
    this._chatSubscription = this._chatService.onMessage.subscribe((message: Message) => this.appendMessage(message));
  }

  ngOnDestroy(): void {
    this._chatSubscription?.unsubscribe();
    this._chatSubscription = null;
  }

  onSendMessage(text: string): void {
    const message: Message = {
      contents: text,
      datePosted: new Date(),
      senderUserId: 1
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

  public get hasMessages(): boolean {
    return this.messages?.length > 0 ?? false;
  }
}
