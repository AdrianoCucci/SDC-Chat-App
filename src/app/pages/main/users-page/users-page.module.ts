import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersPageRoutingModule } from './users-page-routing.module';

import { UsersTableModule } from 'src/app/shared/components/tables/users-table/users-table.module';
import { LoaderModule } from 'src/app/shared/components/loader/loader.module';
import { DialogModule } from 'src/app/shared/components/dialog/dialog.module';
import { ButtonModule } from 'src/app/shared/components/button/button.module';

import { UsersPage } from './users-page.component';

@NgModule({
  declarations: [UsersPage],
  imports: [
    CommonModule,
    UsersPageRoutingModule,
    UsersTableModule,
    LoaderModule,
    DialogModule,
    ButtonModule
  ]
})
export class UsersPageModule { }