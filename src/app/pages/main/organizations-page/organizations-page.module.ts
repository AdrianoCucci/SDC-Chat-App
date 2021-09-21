import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationsPageRoutingModule } from './organizations-page-routing.module';

import { OrganizationsTableModule } from 'src/app/shared/components/tables/organizations-table/organizations-table.module';
import { ButtonModule } from 'src/app/shared/components/button/button.module';
import { DialogModule } from 'src/app/shared/components/dialog/dialog.module';
import { LoaderModule } from 'src/app/shared/components/loader/loader.module';

import { OrganizationsPage } from './organizations-page.component';

@NgModule({
  declarations: [OrganizationsPage],
  imports: [
    CommonModule,
    OrganizationsPageRoutingModule,
    OrganizationsTableModule,
    LoaderModule,
    DialogModule,
    ButtonModule
  ]
})
export class OrganizationsPageModule { }