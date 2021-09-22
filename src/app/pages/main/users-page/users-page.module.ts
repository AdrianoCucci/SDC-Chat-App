import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersPageRoutingModule } from './users-page-routing.module';

import { UsersTableModule } from 'src/app/core/modules/tables/users-table/users-table.module';
import { ButtonModule } from 'src/app/shared/modules/button/button.module';
import { DialogModule } from 'src/app/shared/modules/overlays/dialog/dialog.module';
import { LoaderModule } from 'src/app/shared/modules/overlays/loader/loader.module';

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