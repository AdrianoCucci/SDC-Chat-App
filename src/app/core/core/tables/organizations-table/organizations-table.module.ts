import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from '../../../../modules/shared/table/table.module';
import { DirectivesModule } from 'src/app/modules/shared/directives/directives-module';
import { OrganizationFormModule } from '../../forms/organization-form/organization-form.module';
import { ButtonModule } from '../../../../modules/shared/button/button.module';
import { DialogModule } from '../../../../modules/shared/overlays/dialog/dialog.module';
import { LoaderModule } from '../../../../modules/shared/overlays/loader/loader.module';

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