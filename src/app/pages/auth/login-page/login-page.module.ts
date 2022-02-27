import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageRoutingModule } from './login-page-routing.module';

import { ButtonModule } from 'src/app/shared/modules/button/button.module';
import { FormModule } from 'src/app/shared/modules/forms/form/form.module';
import { InputTextModule } from 'src/app/shared/modules/forms/inputs/input-text/input-text.module';
import { DialogModule } from 'src/app/shared/modules/overlays/dialog/dialog.module';
import { LoaderModule } from 'src/app/shared/modules/overlays/loader/loader.module';
import { VersionModule } from 'src/app/shared/modules/version/version.module';

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
    DialogModule,
    VersionModule
  ]
})
export class LoginPageModule { }