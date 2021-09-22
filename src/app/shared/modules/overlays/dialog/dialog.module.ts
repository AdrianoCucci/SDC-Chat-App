import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from './dialog.component';

const component = [Dialog];

@NgModule({
  imports: [CommonModule],
  exports: component,
  declarations: component
})
export class DialogModule { }