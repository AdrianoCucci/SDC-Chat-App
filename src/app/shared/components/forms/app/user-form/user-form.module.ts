import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormModule } from '../../../../../modules/shared/forms/form/form.module';
import { DialogModule } from '../../../../../modules/shared/overlays/dialog/dialog.module';
import { InputTextModule } from '../../../../../modules/shared/forms/inputs/input-text/input-text.module';
import { InputSelectModule } from '../../../../../modules/shared/forms/inputs/input-select/input-select.module';
import { ButtonModule } from '../../../../../modules/shared/button/button.module';
import { LoaderModule } from '../../../../../modules/shared/overlays/loader/loader.module';
import { InlineAlertModule } from '../../../../../modules/shared/inline-alert/inline-alert.module';

import { UserForm } from './user-form.component';
const component = [UserForm];

@NgModule({
  imports: [
    CommonModule,
    FormModule,
    DialogModule,
    InputTextModule,
    InputSelectModule,
    ButtonModule,
    LoaderModule,
    InlineAlertModule
  ],
  exports: component,
  declarations: component
})
export class UserFormModule { }