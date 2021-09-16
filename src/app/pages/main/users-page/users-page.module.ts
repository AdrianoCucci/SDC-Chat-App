import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersPageRoutingModule } from './users-page-routing.module';

import { UsersTableModule } from 'src/app/shared/components/tables/users-table/users-table.module';

import { UsersPage } from './users-page.component';

@NgModule({
  declarations: [UsersPage],
  imports: [
    CommonModule,
    UsersPageRoutingModule,
    UsersTableModule
  ]
})
export class UsersPageModule { }