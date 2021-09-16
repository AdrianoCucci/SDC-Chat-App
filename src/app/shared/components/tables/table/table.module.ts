import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableComponent } from './table.component';
const component = [TableComponent];

@NgModule({
  imports: [CommonModule],
  exports: component,
  declarations: component
})
export class TableModule { }