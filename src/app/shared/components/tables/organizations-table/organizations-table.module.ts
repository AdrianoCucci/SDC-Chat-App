import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from '../table/table.module';
import { DirectivesModule } from 'src/app/shared/directives/directives-module';
import { ButtonModule } from '../../button/button.module';
import { DialogModule } from '../../dialog/dialog.module';
import { LoaderModule } from '../../loader/loader.module';

import { OrganizationsTableComponent } from './organizations-table.component';
const component = [OrganizationsTableComponent];

@NgModule({
  imports: [
    CommonModule,
    TableModule,
    DirectivesModule,
    ButtonModule,
    DialogModule,
    LoaderModule
  ],
  exports: component,
  declarations: component
})
export class OrganizationsTableModule { }