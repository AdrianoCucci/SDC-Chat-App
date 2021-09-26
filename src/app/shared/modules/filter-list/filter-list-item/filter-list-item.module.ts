import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilterListItem } from './filter-list-item.component';

@NgModule({
  imports: [CommonModule],
  exports: [FilterListItem],
  declarations: [FilterListItem]
})
export class FilterListItemModule { }