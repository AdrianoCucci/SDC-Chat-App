import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class Dialog implements OnInit {
  @Output() public readonly visibleChange = new EventEmitter<boolean>();
  @Output() public readonly onShow = new EventEmitter<void>();
  @Output() public readonly onHide = new EventEmitter<void>();

  @Input() public backdropDismiss: boolean = false;

  @HostBinding("class.visible") private _visible: boolean = false;
  private _contentVisible: boolean = false;

  ngOnInit(): void {
    this._contentVisible = this._visible;
  }

  onBackdropClick(): void {
    if(this.backdropDismiss) {
      this.hide();
    }
  }

  public show(): void {
    this.visible = true;
  }

  public hide(): void {
    this.visible = false;
  }

  public toggleVisible(): void {
    this.visible = !this.visible;
  }

  public get visible(): boolean {
    return this._visible;
  }
  @Input() public set visible(value: boolean) {
    if(this._visible !== value) {
      this._visible = value;
      this.visibleChange.emit(this._visible);

      if(value) {
        this._contentVisible = true;
        this.onShow.emit();
      }
      else {
        this.onHide.emit();
        setTimeout(() => this._contentVisible = false, 160);
      }
    }
  }

  public get contentVisible(): boolean {
    return this._contentVisible;
  }
}
