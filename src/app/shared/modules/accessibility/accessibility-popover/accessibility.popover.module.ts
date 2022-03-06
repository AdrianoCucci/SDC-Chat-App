import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from '../../button/button.module';
import { PopoverModule } from '../../overlays/popover/popover.module';
import { DialogModule } from '../../overlays/dialog/dialog.module';
import { AccessibilityOptionsModule } from '../accessibility-options/accessibility-options.module';

import { AccessibilityPopover } from './accessibility.popover';

@NgModule({
  declarations: [AccessibilityPopover],
  imports: [
    CommonModule,
    ButtonModule,
    PopoverModule,
    DialogModule,
    AccessibilityOptionsModule
  ],
  exports: [AccessibilityPopover]
})
export class AccessibilityPopoverModule { }