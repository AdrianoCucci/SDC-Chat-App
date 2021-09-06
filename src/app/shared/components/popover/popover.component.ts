import { Component, ElementRef, EventEmitter, HostBinding, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class Popover implements OnInit {
  @Output() public readonly onShow = new EventEmitter<void>();
  @Output() public readonly onHide = new EventEmitter<void>();

  @HostBinding("class.visible") private _visible: boolean = false;
  @HostBinding("attr.anchor") private _anchor: string;

  private _contentVisible: boolean = false;
  private _lastTarget: HTMLElement;

  constructor(private _elementRef: ElementRef) { }

  ngOnInit(): void {
    this._contentVisible = this._visible;
  }

  public show(event: MouseEvent): void {
    this._lastTarget = event.target as HTMLElement;

    this.setVisible(true);
    setTimeout(() => this.alignToTarget(event));
  }

  public hide() {
    this.setVisible(false);
  }

  public toggle(event: MouseEvent): void {
    if(this._visible) {
      this.hide();
    }
    else {
      this.show(event);
    }
  }

  private setVisible(value: boolean) {
    if(this._visible != value) {
      this._visible = value;

      if(this._visible) {
        this.onShow.emit();

        setTimeout(() => {
          this._contentVisible = true;
          window.addEventListener("click", this.windowClickHandler);
        });
      }
      else {
        this.onHide.emit();
        setTimeout(() => this._contentVisible = false, 160);
        window.removeEventListener("click", this.windowClickHandler);
      }
    }
  }

  private windowClickHandler = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if(target !== this._lastTarget && !this.nativeElement.contains(target)) {
      this.setVisible(false);
    }
  };

  private alignToTarget(event: MouseEvent): void {
    const hostEl: HTMLElement = this.nativeElement;
    const contentEl: HTMLElement = hostEl.querySelector(".popover-content");
    const posOffset: number = 10;

    let xPos: number = event.x + posOffset;
    let yPos: number = event.y + posOffset;
    let xAnchor: string = "left";
    let yAnchor: string = "top";

    const halfWindowWidth: number = window.innerWidth / 2;
    const halfWindowHeight: number = window.innerHeight / 2;

    if(xPos > halfWindowWidth) {
      xPos -= contentEl.clientWidth + posOffset;
      xAnchor = "right";
    }
    if(yPos > halfWindowHeight) {
      yPos -= contentEl.clientHeight + posOffset;
      yAnchor = "bottom"
    }

    hostEl.style.left = `${xPos}px`;
    hostEl.style.top = `${yPos}px`;
    this._anchor = `${yAnchor} ${xAnchor}`;
  }

  private get nativeElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  public get visible(): boolean {
    return this._visible;
  }

  public get contentVisible(): boolean {
    return this._contentVisible;
  }

  public get anchor(): string {
    return this._anchor;
  }
}
