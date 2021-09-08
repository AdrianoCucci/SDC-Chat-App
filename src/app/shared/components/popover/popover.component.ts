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
  private _currentTimeout: number;

  constructor(private _elementRef: ElementRef) { }

  ngOnInit(): void {
    this._contentVisible = this._visible;
  }

  public show(event: any): void {
    this._lastTarget = null;

    if(event instanceof HTMLElement) {
      this._lastTarget = event;
    }
    else if(event instanceof MouseEvent) {
      this._lastTarget = event.target as HTMLElement;
    }

    if(this._lastTarget != null) {
      this.setVisible(true);
      setTimeout(() => this.alignToTarget(this._lastTarget));
    }
  }

  public hide() {
    this.setVisible(false);
  }

  public toggle(event: any): void {
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

      window.clearTimeout(this._currentTimeout);

      if(this._visible) {
        this.onShow.emit();

        this._currentTimeout = window.setTimeout(() => {
          this._contentVisible = true;
          window.addEventListener("click", this.windowClickHandler);
        });
      }
      else {
        this.onHide.emit();
        this._currentTimeout = window.setTimeout(() => this._contentVisible = false, 160);
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

  private alignToTarget(target: HTMLElement): void {
    const hostEl: HTMLElement = this.nativeElement;
    const contentEl: HTMLElement = hostEl.querySelector(".popover-content");

    const targetRect = target.getBoundingClientRect();
    const posOffset: number = 5;

    let xPos: number = targetRect.x;
    let yPos: number = targetRect.bottom + posOffset;
    let xAnchor: string = "left";
    let yAnchor: string = "top";

    const halfWindowWidth: number = window.innerWidth / 2;
    const halfWindowHeight: number = window.innerHeight / 2;

    if(targetRect.x > halfWindowWidth) {
      xPos -= contentEl.clientWidth - target.clientWidth;
      xAnchor = "right";
    }
    if(targetRect.y > halfWindowHeight) {
      yPos = targetRect.top - contentEl.clientHeight - posOffset;
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
