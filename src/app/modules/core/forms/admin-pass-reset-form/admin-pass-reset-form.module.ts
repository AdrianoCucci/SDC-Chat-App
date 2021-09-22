import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '../../../shared/button/button.module';
import { DialogModule } from '../../../shared/overlays/dialog/dialog.module';
import { LoaderModule } from '../../../shared/overlays/loader/loader.module';
import { FormModule } from '../../../shared/forms/form/form.module';
import { InputTextModule } from '../../../shared/forms/inputs/input-text/input-text.module';
import { InlineAlertModule } from '../../../shared/inline-alert/inline-alert.module';

import { AdminPassResetForm } from './admin-pass-reset-form.component';
const component = [AdminPassResetForm];

@NgModule({
  imports: [
    CommonModule,
    FormModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    LoaderModule,
    InlineAlertModule
  ],
  exports: component,
  declarations: component
})
export class AdminPassResetFormModule { }