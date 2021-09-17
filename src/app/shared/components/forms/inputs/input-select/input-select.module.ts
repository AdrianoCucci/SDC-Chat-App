import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputSelect } from './input-select.component';
const component = [InputSelect];

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: component,
  declarations: component
})
export class InputSelectModule { }