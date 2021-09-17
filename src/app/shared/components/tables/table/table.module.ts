import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { InputTextModule } from '../../forms/inputs/input-text/input-text.module';
import { InputToggleModule } from '../../forms/inputs/input-toggle/input-toggle.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { TableComponent } from './table.component';
const component = [TableComponent];

@NgModule({
  imports: [
    CommonModule,
    NgxDatatableModule,
    InputTextModule,
    InputToggleModule,
    FontAwesomeModule
  ],
  exports: component,
  declarations: component
})
export class TableModule { }