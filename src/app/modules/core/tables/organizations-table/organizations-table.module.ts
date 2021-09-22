import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from '../../../shared/table/table.module';
import { DirectivesModule } from 'src/app/modules/shared/directives/directives-module';
import { OrganizationFormModule } from '../../forms/organization-form/organization-form.module';
import { ButtonModule } from '../../../shared/button/button.module';
import { DialogModule } from '../../../shared/overlays/dialog/dialog.module';
import { LoaderModule } from '../../../shared/overlays/loader/loader.module';

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