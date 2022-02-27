import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputTextModule } from '../../forms/inputs/input-text/input-text.module';
import { InputSelectModule } from '../../forms/inputs/input-select/input-select.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AccessibilityOptionsComponent } from './accessibility-options.component';

@NgModule({
  declarations: [AccessibilityOptionsComponent],
  imports: [
    CommonModule,
    InputTextModule,
    InputSelectModule,
    FontAwesomeModule
  ],
  exports: [AccessibilityOptionsComponent]
})
export class AccessibilityOptionsModule { }