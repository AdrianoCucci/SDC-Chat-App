import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputText } from './input-text.component';

const component = [InputText];

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: component,
  declarations: component
})
export class InputTextModule { }