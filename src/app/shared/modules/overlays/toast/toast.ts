import { EventEmitter } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { getCommonIconDefinition } from 'src/app/shared/functions/get-common-icon-definition';
import { ToastOptions } from './toast-options.model';

export class Toast {
  public readonly options: ToastOptions;
  public readonly onDismiss = new EventEmitter<void>();

  private _dismissTimeout?: number;
  private _dismissed: boolean = false;

  public constructor(options?: ToastOptions) {
    const defaultDuration: number = 3000;

    this.options = options ?? { duration: defaultDuration };
    options.duration = options.duration ?? defaultDuration;

    if (this.options.duration > 0) {
      this.startDismissTimeout();
    }
  }

  public dismiss(): void {
    this._dismissed = true;
    this.onDismiss.emit();
    this.onDismiss.complete();
    this.stopDismissTimeout();

    if (this.options.onDismiss) {
      this.options.onDismiss();
    }
  }

  private startDismissTimeout(): void {
    this.stopDismissTimeout();
    this._dismissTimeout = window.setTimeout(
      () => this.dismiss(),
      this.options.duration
    );
  }

  private stopDismissTimeout(): void {
    window.clearTimeout(this._dismissTimeout);
    this._dismissTimeout = undefined;
  }

  public get icon(): IconDefinition {
    return this.options.icon
      ? getCommonIconDefinition(this.options.icon)
      : null;
  }

  public get dismissed(): boolean {
    return this._dismissed;
  }
}
