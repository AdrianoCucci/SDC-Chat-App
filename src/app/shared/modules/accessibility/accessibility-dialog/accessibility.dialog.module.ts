import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from '../../button/button.module';
import { DialogModule } from '../../overlays/dialog/dialog.module';
import { AccessibilityOptionsModule } from '../accessibility-options/accessibility-options.module';

import { AccessibilityDialog } from './accessibility.dialog';

@NgModule({
  declarations: [AccessibilityDialog],
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    AccessibilityOptionsModule
  ],
  exports: [AccessibilityDialog]
})
export class AccessibilityDialogModule { }