import { ChangeDetectorRef, Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Toast } from './toast';
import { ToastOptions } from './toast-options.model';

@Component({
  selector: 'app-toast-overlay',
  templateUrl: './toast.overlay.html',
  styleUrls: ['./toast.overlay.scss'],
})
export class ToastOverlay {
  public readonly toasts: Toast[] = [];

  constructor(private _changeDetector: ChangeDetectorRef) {}

  public createToast(options?: ToastOptions): Toast {
    const toast = new Toast(options);
    this.toasts.push(toast);

    const dismissSubscription: Subscription = toast.onDismiss.subscribe(() => {
      dismissSubscription.unsubscribe();

      setTimeout(() => {
        const toastIndex: number = this.toasts.indexOf(toast);
        this.toasts.splice(toastIndex, 1);
        this._changeDetector.detectChanges();
      }, 500);
    });

    this._changeDetector.detectChanges();

    return toast;
  }

  public dismissAllToasts(): void {
    this.toasts.forEach((t: Toast) => t.dismiss());
  }

  public getToastAlign(
    toast: Toast,
    index: number,
    element: HTMLElement
  ): string {
    let x: string, y: string;

    switch (toast.options.alignX) {
      default:
        x = 'left: 0';
        break;
      case 'center':
        x = `left: calc(50% - ${element.clientWidth / 2}px)`;
        break;
      case 'end':
        x = 'right: 0';
        break;
    }

    const heightValue: number = index * (element.clientHeight + 2);

    switch (toast.options.alignY) {
      default:
        y = `top: ${heightValue}px`;
        break;
      case 'center':
        y = `top: calc(50% + ${heightValue}px)`;
        break;
      case 'end':
        y = `bottom: ${heightValue}px`;
        break;
    }

    return `${x};${y}`;
  }
}
