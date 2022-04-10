import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationDetailsRoutingModule } from './organization-details-routing.module';

import { OrganizationDetailsPage } from './organization-details.page';

@NgModule({
  declarations: [OrganizationDetailsPage],
  imports: [
    CommonModule,
    OrganizationDetailsRoutingModule
  ]
})
export class OrganizationDetailsModule { }