import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountPageRoutingModule } from './account-page-routing.module';

import { ButtonModule } from 'src/app/shared/modules/button/button.module';
import { LoaderModule } from 'src/app/shared/modules/overlays/loader/loader.module';
import { AccountFormModule } from 'src/app/core/modules/forms/account-form/account-form.module';
import { PassChangeFormModule } from 'src/app/core/modules/forms/pass-change-form/pass-change-form.module';
import { DialogModule } from 'src/app/shared/modules/overlays/dialog/dialog.module';

import { AccountPage } from './account-page.component';

@NgModule({
  declarations: [AccountPage],
  imports: [
    CommonModule,
    AccountPageRoutingModule,
    ButtonModule,
    LoaderModule,
    AccountFormModule,
    PassChangeFormModule,
    DialogModule
  ]
})
export class AccountPageModule { }