import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Keywords } from 'src/app/core/models/chat/keywords';
import { InputTextarea } from 'src/app/shared/modules/forms/inputs/input-textarea/input-textarea.component';
import { KeywordPopoverComponent } from '../keyword-popover/keyword-popover.component';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss'],
})
export class ChatInputComponent {
  @Output() public readonly onPostMessage = new EventEmitter<string>();

  @Input() public initialValue?: string;
  @Input() public keywords?: Keywords;

  @ViewChild(InputTextarea) private readonly _input: InputTextarea;
  @ViewChild(KeywordPopoverComponent)
  private readonly _keywordPopover: KeywordPopoverComponent;

  private _lastCaratPosition: number = 0;

  public focus(): void {
    this._input?.focus();
  }

  public clear(): void {
    this._input?.clear();
  }

  onInput(event: Event): void {
    const keywordPrefix: string = this.keywords?.prefix;
    if (!keywordPrefix) {
      return;
    }

    const inputEvent = event as InputEvent;
    const data: string = inputEvent.data;
    const element = inputEvent.target as HTMLTextAreaElement;

    if (data === keywordPrefix) {
      this._keywordPopover.show(element, 'body');
      this._lastCaratPosition = this.getCaretPosition();
    } else {
      this._keywordPopover.hide();
    }
  }

  onEnterKeydown(): void {
    const value: string | undefined = this._input.value?.trim();

    if (value) {
      this.onPostMessage.emit(value);
    }
  }

  onEscapeKeyDown(): void {
    this._keywordPopover.hide();
  }

  onPopoverKeywordSelect(keyword: string): void {
    this._input.value = this.insertKeyword(
      this._input.value,
      keyword,
      this._lastCaratPosition
    );

    this._keywordPopover.hide();
    this.focus();
    setTimeout(() =>
      this.setCaretPosition(this._lastCaratPosition + keyword.length)
    );
  }

  private getCaretPosition(): number {
    return this._input.input.selectionStart;
  }

  private setCaretPosition(value: number): void {
    this._input.input.setSelectionRange(value, value, 'none');
  }

  private insertKeyword(text: string, keyword: string, index: number): string {
    return text.substring(0, index) + keyword + text.substring(index);
  }

  public get value(): string {
    return this._input?.value;
  }
}
