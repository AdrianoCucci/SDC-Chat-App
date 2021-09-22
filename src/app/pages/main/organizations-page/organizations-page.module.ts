import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationsPageRoutingModule } from './organizations-page-routing.module';

import { OrganizationsTableModule } from 'src/app/core/modules/tables/organizations-table/organizations-table.module';
import { ButtonModule } from 'src/app/shared/modules/button/button.module';
import { DialogModule } from 'src/app/modules/shared/overlays/dialog/dialog.module';
import { LoaderModule } from 'src/app/modules/shared/overlays/loader/loader.module';

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