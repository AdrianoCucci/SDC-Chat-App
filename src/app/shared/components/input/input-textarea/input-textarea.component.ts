import { AfterViewInit, Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input-textarea',
  templateUrl: './input-textarea.component.html',
  styleUrls: ['./input-textarea.component.scss']
})
export class InputTextarea implements OnInit, AfterViewInit {
  @Output() public readonly valueChange = new EventEmitter<string>();

  @Input() public cols: number = 10;
  @Input() public rows: number = 1;
  @Input() @HostBinding("class.resizable") public resizable: boolean = false;
  @Input() @HostBinding("class.auto-resize") public autoResize: boolean = false;

  private _initialized: boolean = false;
  private _value: string;
  private _autoResizeLines: number;

  ngOnInit(): void {
    this.updateAutoResize(this._value);
  }

  ngAfterViewInit(): void {
    setTimeout(() => this._initialized = true);
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
