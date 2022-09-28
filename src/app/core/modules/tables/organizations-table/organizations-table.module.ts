import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'src/app/shared/modules/button/button.module';
import { DirectivesModule } from 'src/app/shared/modules/directives/directives-module';
import { DialogModule } from 'src/app/shared/modules/overlays/dialog/dialog.module';
import { ConfirmDialogModule } from 'src/app/shared/modules/overlays/dialog/confirm-dialog/confirm-dialog.module';
import { LoaderModule } from 'src/app/shared/modules/overlays/loader/loader.module';
import { TableModule } from 'src/app/shared/modules/table/table.module';
import { OrganizationFormModule } from '../../forms/organization-form/organization-form.module';

import { OrganizationsTable } from './organizations-table.component';
const component = [OrganizationsTable];

@NgModule({
  imports: [
    CommonModule,
    TableModule,
    DirectivesModule,
    OrganizationFormModule,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
    LoaderModule,
  ],
  exports: component,
  declarations: component,
})
export class OrganizationsTableModule {}
