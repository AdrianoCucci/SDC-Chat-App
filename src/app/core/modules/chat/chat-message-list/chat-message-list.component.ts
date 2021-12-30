import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ChatMessage } from 'src/app/core/models/messages/chat-message';
import { User } from 'src/app/core/models/users/user';
import { InputTextarea } from 'src/app/shared/modules/forms/inputs/input-textarea/input-textarea.component';
import { Popover } from 'src/app/shared/modules/overlays/popover/popover.component';
import { ChatMessageComponent, DeleteEventArgs } from '../chat-message/chat-message.component';

@Component({
  selector: 'app-chat-message-list',
  templateUrl: './chat-message-list.component.html',
  styleUrls: ['./chat-message-list.component.scss']
})
export class ChatMessageListComponent implements AfterViewInit {
  @Output() public readonly onAddMessage = new EventEmitter<ChatMessage>();
  @Output() public readonly onEditMessage = new EventEmitter<ChatMessage>();
  @Output() public readonly onDeleteMessage = new EventEmitter<ChatMessage>();

  @Input() public messages: ChatMessage[];
  @Input() public clientUser: User;

  @ViewChild("messagesScrollWrapper") private readonly _messagesScrollWrapperRef: ElementRef;
  @ViewChild(Popover) private readonly _deletePopover: Popover;

  private _deletingMessage: ChatMessage;

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
      datePosted: new Date().toISOString(),
      senderUserId: null
    };

    this.onAddMessage.emit(message);
  }

  onPromptDeleteMessage(event: DeleteEventArgs): void {
    this._deletePopover.hide();

    this._deletingMessage = event.message;
    this._deletePopover.show(event.clickEvent, "body");
  }

  onDeletePromptCancel(): void {
    this._deletePopover.hide();
    this._deletingMessage = null;
  }

  onDeletePromptConfirm(): void {
    this._deletePopover.hide();

    setTimeout(() => {
      this.onDeleteMessage.emit({ ...this._deletingMessage });
      this._deletingMessage = null;
    }, 160);
  }

  public get deletingMessage(): any {
    return this._deletingMessage;
  }
}