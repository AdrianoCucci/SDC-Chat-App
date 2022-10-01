import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { faComments, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ChatMessage } from 'src/app/core/models/messages/chat-message';
import { User } from 'src/app/core/models/users/user';
import { InputTextarea } from 'src/app/shared/modules/forms/inputs/input-textarea/input-textarea.component';
import { Popover } from 'src/app/shared/modules/overlays/popover/popover.component';
import { DeleteEventArgs } from '../chat-message/chat-message.component';

@Component({
  selector: 'app-chat-message-list',
  templateUrl: './chat-message-list.component.html',
  styleUrls: ['./chat-message-list.component.scss'],
})
export class ChatMessageListComponent implements AfterViewInit, OnDestroy {
  @Output() public readonly onAddMessage = new EventEmitter<ChatMessage>();
  @Output() public readonly onEditMessage = new EventEmitter<ChatMessage>();
  @Output() public readonly onDeleteMessage = new EventEmitter<ChatMessage>();
  @Output() public readonly onScrollTopReached = new EventEmitter<void>();

  public readonly noMessagesIcon: IconDefinition = faComments;

  @Input() public messages: ChatMessage[];
  @Input() public clientUser: User;
  @Input() public listLoaderVisible: boolean = false;

  @ViewChild('messagesScrollWrapper')
  private readonly _messagesScrollWrapperRef: ElementRef;
  @ViewChild(Popover) private readonly _deletePopover: Popover;

  private readonly _scrollTopLoadThreshold: number = 100;

  private _allowScrollTopReachedEvent: boolean = true;
  private _deletingMessage: ChatMessage;

  ngAfterViewInit(): void {
    this.scrollToBottom('auto');

    const scrollWrapper = this._messagesScrollWrapperRef
      .nativeElement as HTMLElement;
    scrollWrapper.onscroll = () => this.onScrollWrapperScroll(scrollWrapper);
  }

  ngOnDestroy(): void {
    const scrollWrapper = this._messagesScrollWrapperRef
      .nativeElement as HTMLElement;
    scrollWrapper.onscroll = null;
  }

  onTextareaEnter(textArea: InputTextarea): void {
    const value: string | undefined = textArea.value?.trim();

    if (value) {
      this.sendMessage(value);
    }

    setTimeout(() => {
      textArea.clear();
      textArea.focus();

      if (value) {
        this.scrollToBottom();
      }
    });
  }

  public scrollToBottom(behavior: ScrollBehavior = 'smooth') {
    if (this._messagesScrollWrapperRef != null) {
      const scrollWrapper: HTMLElement =
        this._messagesScrollWrapperRef.nativeElement;

      scrollWrapper.scrollTo({
        top: scrollWrapper.scrollHeight,
        behavior,
      });
    }
  }

  private onScrollWrapperScroll(scrollWrapper: HTMLElement): void {
    const scrollThreshold: number =
      scrollWrapper.scrollHeight -
      Math.abs(scrollWrapper.scrollTop) -
      scrollWrapper.clientHeight;

    if (scrollThreshold < this._scrollTopLoadThreshold) {
      if (this._allowScrollTopReachedEvent) {
        this.onScrollTopReached.emit();
        this._allowScrollTopReachedEvent = false;
      }
    } else {
      this._allowScrollTopReachedEvent = true;
    }
  }

  private sendMessage(text: string): void {
    const message: ChatMessage = {
      contents: text,
      datePosted: new Date().toISOString(),
      senderUserId: null,
    };

    this.onAddMessage.emit(message);
  }

  onPromptDeleteMessage(event: DeleteEventArgs): void {
    this._deletePopover.hide();

    this._deletingMessage = event.message;
    this._deletePopover.show(event.clickEvent, 'body');
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

  public get hasMessages(): boolean {
    return this.messages?.length > 0;
  }

  public get deletingMessage(): any {
    return this._deletingMessage;
  }
}
