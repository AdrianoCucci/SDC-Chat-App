import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Message } from 'src/app/core/models/messages/message';
import { ChatService } from 'src/app/core/services/chat.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent implements OnInit, OnDestroy {
  private _subscription: Subscription;

  constructor(private _chatService: ChatService) { }

  ngOnInit(): void {
    this._subscription = this._chatService.onMessage.subscribe((message: Message) => this.onMessageReceived(message));
  }

  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
    this._subscription = null;
  }

  private onMessageReceived(message: Message) {
    console.log("MESSAGE FROM SERVER:", message);
  }
}