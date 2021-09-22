import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageRoutingModule } from './login-page-routing.module';

import { FormModule } from 'src/app/shared/components/forms/form/form.module';
import { InputTextModule } from 'src/app/shared/components/forms/inputs/input-text/input-text.module';
import { ButtonModule } from 'src/app/shared/components/button/button.module';
import { LoaderModule } from 'src/app/modules/shared/overlays/loader/loader.module';
import { DialogModule } from 'src/app/modules/shared/overlays/dialog/dialog.module';

import { LoginPage } from './login-page.component';

@NgModule({
  declarations: [LoginPage],
  imports: [
    CommonModule,
    LoginPageRoutingModule,
    FormModule,
    InputTextModule,
    ButtonModule,
    LoaderModule,
    DialogModule
  ]
})
export class LoginPageModule { }