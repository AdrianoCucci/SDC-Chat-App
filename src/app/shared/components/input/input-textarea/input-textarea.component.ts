import { AfterViewInit, Component, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-input-textarea',
  templateUrl: './input-textarea.component.html',
  styleUrls: ['./input-textarea.component.scss']
})
export class InputTextarea implements OnInit, AfterViewInit {
  @Output() public readonly valueChange = new EventEmitter<string>();

  @Input() public cols: number = 10;
  @Input() public rows: number = 1;
  @Input() public placeholder: string = "";
  @Input() @HostBinding("class.resizable") public resizable: boolean = false;
  @Input() @HostBinding("class.auto-resize") public autoResize: boolean = false;

  @ViewChild("nativeInput") private readonly _nativeInput: ElementRef;

  private _initialized: boolean = false;
  private _value: string;
  private _autoResizeLines: number;

  ngOnInit(): void {
    this.updateAutoResize(this._value);
  }

  ngAfterViewInit(): void {
    setTimeout(() => this._initialized = true);
  }

  public focus() {
    this.nativeInput?.focus();
  }

  public clear() {
    this.value = null;
  }

  private onValueSetting(newValue: string): string {
    this.updateAutoResize(newValue);
    return newValue;
  }

  private updateAutoResize(value: string) {
    if(this.autoResize) {
      const lineCount: number = value ? value.split("\n").length : 1;
      this._autoResizeLines = lineCount;
    }
  }

  private get nativeInput(): HTMLTextAreaElement {
    return this._nativeInput?.nativeElement ?? null;
  }

  public get value(): string {
    return this._value;
  }
  @Input() public set value(newValue: string) {
    if(this._value != newValue) {
      this._value = this.onValueSetting(newValue);

      if(this._initialized) {
        this.valueChange.emit(this._value);
      }
    }
  }

  @HostBinding("style.--auto-resize-lines") public get autoResizeLines(): number {
    return this._autoResizeLines;
  }
}
