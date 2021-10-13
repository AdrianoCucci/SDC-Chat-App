import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from '../../../button/button.module';

import { ConfirmDialog } from './confirm-dialog.component';
const component = [ConfirmDialog];

@NgModule({
  imports: [
    CommonModule,
    ButtonModule
  ],
  exports: component,
  declarations: component
})
export class ConfirmDialogModule { }