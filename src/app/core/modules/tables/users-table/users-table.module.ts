import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'src/app/shared/modules/button/button.module';
import { DirectivesModule } from 'src/app/shared/modules/directives/directives-module';
import { DialogModule } from 'src/app/shared/modules/overlays/dialog/dialog.module';
import { ConfirmDialogModule } from 'src/app/shared/modules/overlays/dialog/confirm-dialog/confirm-dialog.module';
import { LoaderModule } from 'src/app/shared/modules/overlays/loader/loader.module';
import { TableModule } from 'src/app/shared/modules/table/table.module';
import { AdminPassResetFormModule } from '../../forms/admin-pass-reset-form/admin-pass-reset-form.module';
import { UserFormModule } from '../../forms/user-form/user-form.module';

import { UsersTable } from './users-table.component';
const component = [UsersTable];

@NgModule({
  imports: [
    CommonModule,
    TableModule,
    DirectivesModule,
    ButtonModule,
    UserFormModule,
    AdminPassResetFormModule,
    DialogModule,
    ConfirmDialogModule,
    LoaderModule,
  ],
  exports: component,
  declarations: component,
})
export class UsersTableModule {}
