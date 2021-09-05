import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormGroup } from './form-group.component';
const component = [FormGroup];

@NgModule({
  imports: [CommonModule],
  exports: component,
  declarations: component
})
export class FormGroupModule { }