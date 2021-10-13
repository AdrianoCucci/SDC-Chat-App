import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ChatMessage } from 'src/app/core/models/messages/chat-message';
import { User } from 'src/app/core/models/users/user';
import { InputTextarea } from 'src/app/shared/modules/forms/inputs/input-textarea/input-textarea.component';

@Component({
  selector: 'app-chat-message-list',
  templateUrl: './chat-message-list.component.html',
  styleUrls: ['./chat-message-list.component.scss']
})
export class ChatMessageListComponent implements AfterViewInit {
  @Output() public readonly onAddMessage = new EventEmitter<ChatMessage>();
  @Input() public messages: ChatMessage[];
  @Input() public clientUser: User;

  @ViewChild("messagesScrollWrapper") private readonly _messagesScrollWrapperRef: ElementRef;

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
    if(this._messagesScrollWrapperRef != null) {
      const scrollWrapper: HTMLElement = this._messagesScrollWrapperRef.nativeElement;

      scrollWrapper.scrollTo({
        top: scrollWrapper.scrollHeight,
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