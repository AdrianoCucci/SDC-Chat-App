import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Message } from 'src/app/core/models/messages/message';
import { ChatService } from 'src/app/core/services/chat.service';
import { InputTextarea } from '../../input/input-textarea/input-textarea.component';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() public messages: Message[];

  @ViewChild("messagesList") private readonly _messagesListRef: ElementRef;

  private _chatSubscription: Subscription;

  constructor(private _chatService: ChatService) { }

  ngOnInit(): void {
    this._chatSubscription = this._chatService.onMessage.subscribe((message: Message) => this.appendMessage(message));
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this._chatSubscription?.unsubscribe();
    this._chatSubscription = null;
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
