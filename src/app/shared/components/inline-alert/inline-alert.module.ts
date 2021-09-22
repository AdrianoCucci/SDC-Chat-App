import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from '../../../modules/shared/button/button.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { InlineAlert } from './inline-alert.component';
const component = [InlineAlert];

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    FontAwesomeModule
  ],
  exports: component,
  declarations: component
})
export class InlineAlertModule { }