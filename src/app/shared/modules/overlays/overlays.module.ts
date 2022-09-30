import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopoverModule } from './popover/popover.module';
import { LoaderModule } from './loader/loader.module';

@NgModule({
  imports: [CommonModule, PopoverModule, LoaderModule],
})
export class OverlaysModule {}
