import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ChatMessage } from 'src/app/core/models/messages/chat-message';
import { InputTextarea } from '../../forms/inputs/input-textarea/input-textarea.component';

@Component({
  selector: 'app-chat-message-list',
  templateUrl: './chat-message-list.component.html',
  styleUrls: ['./chat-message-list.component.scss']
})
export class ChatMessageListComponent implements AfterViewInit {
  @Output() public readonly onAddMessage = new EventEmitter<ChatMessage>();
  @Input() public messages: ChatMessage[];

  @ViewChild("messagesList") private readonly _messagesListRef: ElementRef;

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  onTextareaEnter(textArea: InputTextarea): void {
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

  public scrollToBottom() {
    if(this._messagesListRef != null) {
      const list: HTMLElement = this._messagesListRef.nativeElement;

      list.scrollTo({
        top: list.scrollHeight,
        behavior: "smooth"
      });
    }
  }

  private sendMessage(text: string): void {
    const message: ChatMessage = {
      contents: text,
      datePosted: new Date(),
      senderUserId: null
    };

    this.onAddMessage.emit(message);
  }
}