import { CommonIcon } from 'src/app/shared/models/common-icon.type';
import { ToastAlign } from './toast-align.type';

export interface ToastOptions {
  text?: string;
  icon?: CommonIcon;
  alignX?: ToastAlign;
  alignY?: ToastAlign;
  class?: string;
  textClass?: string;
  iconClass?: string;
  dismissButtonClass?: string;
  style?: object;
  duration?: number;
  dismissButton?: boolean;
  onDismiss?: () => void;
}
