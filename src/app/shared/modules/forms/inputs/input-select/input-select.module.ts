import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from '../../../button/button.module';
import { PopoverModule } from '../../../overlays/popover/popover.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { InputSelect } from './input-select.component';
const component = [InputSelect];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    PopoverModule,
    FontAwesomeModule,
  ],
  exports: component,
  declarations: component,
})
export class InputSelectModule {}
