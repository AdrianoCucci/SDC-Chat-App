import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonModule } from '../../button/button.module';

import { ToastOverlay } from './toast.overlay';

@NgModule({
  declarations: [ToastOverlay],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ButtonModule
  ],
  exports: [ToastOverlay]
})
export class ToastOverlayModule { }