import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from '../table/table.module';
import { DirectivesModule } from 'src/app/shared/directives/directives-module';
import { ButtonModule } from '../../button/button.module';

import { UsersTableComponent } from './users-table.component';
import { UserFormModule } from '../../forms/app/user-form/user-form.module';
const component = [UsersTableComponent];

@NgModule({
  imports: [
    CommonModule,
    TableModule,
    DirectivesModule,
    ButtonModule,
    UserFormModule
  ],
  exports: component,
  declarations: component
})
export class UsersTableModule { }