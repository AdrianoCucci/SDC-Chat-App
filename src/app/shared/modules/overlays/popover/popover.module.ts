import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Popover } from './popover.component';
const component = [Popover];

@NgModule({
  imports: [CommonModule],
  exports: component,
  declarations: component,
})
export class PopoverModule {}
