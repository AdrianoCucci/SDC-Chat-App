import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationsPageRoutingModule } from './organizations-page-routing.module';

import { OrganizationsPage } from './organizations-page.component';

@NgModule({
  declarations: [OrganizationsPage],
  imports: [
    CommonModule,
    OrganizationsPageRoutingModule
  ]
})
export class OrganizationsPageModule { }