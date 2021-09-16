import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersPageRoutingModule } from './users-page-routing.module';

import { UsersTableModule } from 'src/app/shared/components/tables/users-table/users-table.module';
import { LoaderModule } from 'src/app/shared/components/loader/loader.module';

import { UsersPage } from './users-page.component';

@NgModule({
  declarations: [UsersPage],
  imports: [
    CommonModule,
    UsersPageRoutingModule,
    UsersTableModule,
    LoaderModule
  ]
})
export class UsersPageModule { }