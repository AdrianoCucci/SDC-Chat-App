import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from '../../../../modules/shared/table/table.module';
import { DirectivesModule } from 'src/app/modules/shared/directives/directives-module';
import { ButtonModule } from '../../../../shared/modules/button/button.module';
import { UserFormModule } from 'src/app/core/core/forms/user-form/user-form.module';
import { AdminPassResetFormModule } from '../../forms/admin-pass-reset-form/admin-pass-reset-form.module';
import { DialogModule } from '../../../../modules/shared/overlays/dialog/dialog.module';
import { LoaderModule } from '../../../../modules/shared/overlays/loader/loader.module';

import { UsersTableComponent } from './users-table.component';
const component = [UsersTableComponent];

@NgModule({
  imports: [
    CommonModule,
    TableModule,
    DirectivesModule,
    ButtonModule,
    UserFormModule,
    AdminPassResetFormModule,
    DialogModule,
    LoaderModule
  ],
  exports: component,
  declarations: component
})
export class UsersTableModule { }