import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'src/app/shared/modules/table/table.module';

import { RoomsTable } from './rooms-table.component';
const component = [RoomsTable];

@NgModule({
  imports: [
    CommonModule,
    TableModule
  ],
  exports: component,
  declarations: component
})
export class RoomsTableModule { }