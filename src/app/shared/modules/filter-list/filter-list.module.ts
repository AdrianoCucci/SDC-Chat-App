import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilterList } from './filter-list.component';
const component = [FilterList];

@NgModule({
  imports: [CommonModule],
  exports: component,
  declarations: component
})
export class FilterListModule { }