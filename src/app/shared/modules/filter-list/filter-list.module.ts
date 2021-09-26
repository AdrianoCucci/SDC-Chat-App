import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilterListItemModule } from './filter-list-item/filter-list-item.module';

import { FilterList } from './filter-list.component';

@NgModule({
  imports: [
    CommonModule,
    FilterListItemModule
  ],
  exports: [FilterList],
  declarations: [FilterList]
})
export class FilterListModule { }