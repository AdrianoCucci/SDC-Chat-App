import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationDetailsRoutingModule } from './organization-details-routing.module';

import { ButtonModule } from 'src/app/shared/modules/button/button.module';
import { OrganizationFormModule } from 'src/app/core/modules/forms/organization-form/organization-form.module';

import { OrganizationDetailsPage } from './organization-details.page';

@NgModule({
  declarations: [OrganizationDetailsPage],
  imports: [
    CommonModule,
    OrganizationDetailsRoutingModule,
    ButtonModule,
    OrganizationFormModule
  ]
})
export class OrganizationDetailsModule { }