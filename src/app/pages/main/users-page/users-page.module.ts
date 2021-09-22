import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersPageRoutingModule } from './users-page-routing.module';

import { UsersTableModule } from 'src/app/modules/core/tables/users-table/users-table.module';
import { LoaderModule } from 'src/app/modules/shared/overlays/loader/loader.module';
import { DialogModule } from 'src/app/modules/shared/overlays/dialog/dialog.module';
import { ButtonModule } from 'src/app/modules/shared/button/button.module';

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