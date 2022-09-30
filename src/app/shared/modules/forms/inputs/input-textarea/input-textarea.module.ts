import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputTextarea } from './input-textarea.component';
const component = [InputTextarea];

@NgModule({
  imports: [CommonModule, FormsModule],
  exports: component,
  declarations: component,
})
export class InputTextareaModule {}
