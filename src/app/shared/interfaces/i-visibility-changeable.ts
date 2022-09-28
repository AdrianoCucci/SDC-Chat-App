import { EventEmitter } from '@angular/core';

export interface IVisibilityChangeable {
  visibleChange: EventEmitter<boolean>;
  onShow: EventEmitter<void>;
  onHide: EventEmitter<void>;

  visible: boolean;

  show(params?: any): void;

  hide(params?: any): void;

  toggleVisible(params?: any): void;
}
