import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from '../table/table.module';
import { DirectivesModule } from 'src/app/shared/directives/directives-module';
import { ButtonModule } from '../../button/button.module';
import { UserFormModule } from '../../forms/app/user-form/user-form.module';
import { DialogModule } from '../../dialog/dialog.module';
import { LoaderModule } from '../../loader/loader.module';

import { UsersTableComponent } from './users-table.component';
const component = [UsersTableComponent];

@NgModule({
  imports: [
    CommonModule,
    TableModule,
    DirectivesModule,
    ButtonModule,
    UserFormModule,
    DialogModule,
    LoaderModule
  ],
  exports: component,
  declarations: component
})
export class UsersTableModule { }