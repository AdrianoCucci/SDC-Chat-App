import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Button } from './button.component';
const component = [Button];

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: component,
  declarations: component
})
export class ButtonModule { }