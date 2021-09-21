import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from '../table/table.module';
import { DirectivesModule } from 'src/app/shared/directives/directives-module';
import { OrganizationFormModule } from '../../forms/app/organization-form/organization-form.module';
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
    OrganizationFormModule,
    ButtonModule,
    DialogModule,
    LoaderModule
  ],
  exports: component,
  declarations: component
})
export class OrganizationsTableModule { }