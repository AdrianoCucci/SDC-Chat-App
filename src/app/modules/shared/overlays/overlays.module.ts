import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopoverModule } from './popover/popover.module';

@NgModule({
  imports: [
    CommonModule,
    PopoverModule
  ]
})
export class OverlaysModule { }