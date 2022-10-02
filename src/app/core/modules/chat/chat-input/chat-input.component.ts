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

  private _keywordCaratPosition: number = 0;

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

    if (data === keywordPrefix) {
      this.onKeywordPrefixInput();
    } else if (this._keywordPopover.visible) {
      this.updateKeywordPopoverFilter();
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

  onTabKeyDown(): void {
    if (this._keywordPopover.visible) {
      this._keywordPopover.focus();
    }
  }

  onPopoverKeywordSelect(keyword: string): void {
    this.insertKeyword(keyword);
    setTimeout(() => this._keywordPopover.hide());
  }

  onPopoverHide(): void {
    this.focus();
  }

  private onKeywordPrefixInput(): void {
    this._keywordPopover.keywordFilter = undefined;
    this._keywordPopover.show(this._input.input, 'body');
    this._keywordCaratPosition = this.getCaretPosition();
  }

  private updateKeywordPopoverFilter(): void {
    const caratPosition: number = this.getCaretPosition();
    if (caratPosition < this._keywordCaratPosition) {
      return;
    }

    this._keywordPopover.keywordFilter = this._input.value.substring(
      this._keywordCaratPosition,
      this.getCaretPosition()
    );

    if (!this._keywordPopover.hasKeywordSuggestions) {
      this._keywordPopover.hide();
    }
  }

  private getCaretPosition(): number {
    return this._input.input.selectionStart;
  }

  private insertKeyword(keyword: string): void {
    const currentValue: string = this._input.value;
    const insertPosition: number = this._keywordCaratPosition;

    const insertedValue: string =
      currentValue.substring(0, insertPosition) +
      keyword +
      currentValue.substring(insertPosition + keyword.length);

    this._input.value = insertedValue;
  }

  public get value(): string {
    return this._input?.value;
  }
}
