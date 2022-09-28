import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dialog } from '../dialog.component';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialog extends Dialog {
  @Output() public readonly onCancel = new EventEmitter<any>();
  @Output() public readonly onConfirm = new EventEmitter<any>();

  @Input() public dismissButton: boolean = true;
  @Input() public header: string;
  @Input() public cancelText: string = 'Cancel';
  @Input() public confirmText: string = 'Confirm';

  onCancelClick(): void {
    this.onCancel.emit(this.data);
    this.hide();
  }

  onConfirmClick(): void {
    this.onConfirm.emit(this.data);
    this.hide();
  }
}
