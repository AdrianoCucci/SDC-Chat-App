import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Form } from './form.component';
const component = [Form];

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: component,
  declarations: component
})
export class FormModule { }