import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountDetailsRoutingModule } from './account-details-routing.module';

import { ButtonModule } from 'src/app/shared/modules/button/button.module';
import { AccountFormModule } from 'src/app/core/modules/forms/account-form/account-form.module';
import { PassChangeFormModule } from 'src/app/core/modules/forms/pass-change-form/pass-change-form.module';

import { AccountDetailsPage } from './account-details.page';

@NgModule({
  declarations: [AccountDetailsPage],
  imports: [
    CommonModule,
    AccountDetailsRoutingModule,
    ButtonModule,
    AccountFormModule,
    PassChangeFormModule
  ]
})
export class AccountDetailsModule { }