import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'src/app/shared/modules/button/button.module';
import { FormModule } from 'src/app/shared/modules/forms/form/form.module';
import { InputTextModule } from 'src/app/shared/modules/forms/inputs/input-text/input-text.module';
import { InputSelectModule } from 'src/app/shared/modules/forms/inputs/input-select/input-select.module';
import { InputToggleModule } from 'src/app/shared/modules/forms/inputs/input-toggle/input-toggle.module';
import { InlineAlertModule } from 'src/app/shared/modules/inline-alert/inline-alert.module';
import { DialogModule } from 'src/app/shared/modules/overlays/dialog/dialog.module';
import { LoaderModule } from 'src/app/shared/modules/overlays/loader/loader.module';

import { UserForm } from './user-form.component';
const component = [UserForm];

@NgModule({
  imports: [
    CommonModule,
    FormModule,
    DialogModule,
    InputTextModule,
    InputSelectModule,
    InputToggleModule,
    ButtonModule,
    LoaderModule,
    InlineAlertModule
  ],
  exports: component,
  declarations: component
})
export class UserFormModule { }