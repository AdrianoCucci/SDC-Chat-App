import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountDetailsRoutingModule } from './account-details-routing.module';

import { AccountDetailsPage } from './account-details.page';

@NgModule({
  declarations: [AccountDetailsPage],
  imports: [
    CommonModule,
    AccountDetailsRoutingModule
  ]
})
export class AccountDetailsModule { }