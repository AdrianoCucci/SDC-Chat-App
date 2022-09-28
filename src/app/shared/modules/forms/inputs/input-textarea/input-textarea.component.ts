import {
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormInput } from '../base/form-input';
import { TextAreaValidations } from './text-area-validations';

@Component({
  selector: 'app-input-textarea',
  templateUrl: './input-textarea.component.html',
  styleUrls: ['./input-textarea.component.scss'],
  providers: [{ provide: FormInput, useExisting: InputTextarea }],
})
export class InputTextarea extends FormInput<string> implements OnInit {
  @Input() public cols: number = 10;
  @Input() public rows: number = 1;
  @Input() public placeholder: string = '';
  @Input() @HostBinding('class.resizable') public resizable: boolean = false;
  @Input() @HostBinding('class.auto-resize') public autoResize: boolean = false;
  @Input() public validations: TextAreaValidations = null;

  @ViewChild('input') private readonly _inputRef: ElementRef;

  private _autoResizeLines: number;

  ngOnInit(): void {
    this.updateAutoResize(this._value);
  }

  public focus() {
    this.input?.focus();
  }

  protected onValueSetting(newValue: string): string {
    this.updateAutoResize(newValue);
    return newValue;
  }

  private updateAutoResize(value: string) {
    if (this.autoResize) {
      const lineCount: number = value ? value.split('\n').length : 1;
      this._autoResizeLines = lineCount;
    }
  }

  private get input(): HTMLTextAreaElement {
    return this._inputRef?.nativeElement ?? null;
  }

  public get minLength(): number {
    return this.validations?.minLength;
  }

  public get maxLength(): number {
    return this.validations?.maxLength;
  }

  @HostBinding('style.--auto-resize-lines')
  public get autoResizeLines(): number {
    return this._autoResizeLines;
  }
}
