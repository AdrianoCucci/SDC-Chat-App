import { Component, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IVisibilityChangeable } from 'src/app/shared/interfaces/i-visibility-changeable';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class Popover implements OnInit, IVisibilityChangeable {
  @Output() public readonly visibleChange = new EventEmitter<boolean>();
  @Output() public readonly onShow = new EventEmitter<void>();
  @Output() public readonly onHide = new EventEmitter<void>();

  @Input() public parent?: PopoverParent;

  @ViewChild("content") private readonly _contentRef: ElementRef;

  @HostBinding("class.visible") private _visible: boolean = false;
  @HostBinding("attr.anchor") private _anchor: string;

  private _nativeElement: HTMLElement;
  private _originalParent: HTMLElement;
  private _contentVisible: boolean = false;
  private _currentTimeout: number;
  private _currentTarget: HTMLElement;

  constructor(elementRef: ElementRef) {
    this._nativeElement = elementRef.nativeElement;
    this._originalParent = this._nativeElement.parentElement || document.body;
  }

  ngOnInit(): void {
    this._contentVisible = this._visible;
  }

  public show(event: any, parent?: PopoverParent): void {
    if(event instanceof HTMLElement) {
      this._currentTarget = event;
    }
    else if(event instanceof MouseEvent) {
      this._currentTarget = event.target as HTMLElement;
    }

    if(parent) {
      this.parent = parent;
    }

    this.visible = true;
  }

  public hide(): void {
    this.visible = false;
  }

  public toggleVisible(event: any, parent?: PopoverParent): void {
    if(this._visible) {
      this.hide();
    }
    else {
      this.show(event, parent);
    }
  }

  private updateContentVisible(visible: boolean): void {
    window.clearTimeout(this._currentTimeout);

    if(visible) {
      this._contentVisible = true;

      this._currentTimeout = window.setTimeout(() => {
        this.setParent(this._nativeElement, this.parent);
        this.alignToTarget(this._nativeElement, this._currentTarget, this.parent);
        this.setEventHandlersEnabled(true);
      });
    }
    else {
      this.setEventHandlersEnabled(false);

      this._currentTimeout = window.setTimeout(() => {
        this._contentVisible = false;
        this.setParent(this._nativeElement, this._originalParent);
      }, 160);
    }
  }

  private setParent(host: HTMLElement, parent?: PopoverParent): void {
    if(parent === "body") {
      document.body.appendChild(host);
    }
    else if(parent instanceof HTMLElement) {
      parent.appendChild(host);
    }
  }

  private alignToTarget(host: HTMLElement, target: HTMLElement, parent?: PopoverParent): void {
    const targetRect: DOMRect = target.getBoundingClientRect();

    const halfWindowWidth: number = window.innerWidth / 2;
    const halfWindowHeight: number = window.innerHeight / 2;

    this._anchor = targetRect.y < halfWindowHeight ? "top" : "bottom";

    host.style.top = this._anchor === "top" ? "100%" : `-${host.offsetHeight}px`;
    host.style.left = targetRect.x < halfWindowWidth ? "0" : `calc(100% - ${host.offsetWidth}px)`;

    // host.style.left = `${targetRect.x}px`;
    // host.style.top = `${targetRect.y}px`;
  }

  private setEventHandlersEnabled(enabled: boolean) {
    if(enabled) {
      window.addEventListener("click", this.windowClickHandler);
      window.addEventListener("resize", this.windowResizeHandler);
    }
    else {
      window.removeEventListener("click", this.windowClickHandler);
      window.removeEventListener("resize", this.windowResizeHandler);
    }
  }

  private windowClickHandler = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;

    if(target !== this._currentTarget && !this._nativeElement.contains(target)) {
      this.visible = false;
    }
  };

  private windowResizeHandler = (): void => {
    if(this._visible && this._currentTarget != null) {
      this.alignToTarget(this._nativeElement, this._currentTarget, this.parent);
    }
  };

  public get visible(): boolean {
    return this._visible;
  }
  @Input() public set visible(value: boolean) {
    if(this._visible !== value) {
      this._visible = value;
      this.visibleChange.emit(this._visible);

      if(this._visible) {
        this.onShow.emit();
      }
      else {
        this.onHide.emit();
      }

      this.updateContentVisible(this._visible);
    }
  }

  public get contentVisible(): boolean {
    return this._contentVisible;
  }
}

type PopoverParent = HTMLElement | "body";