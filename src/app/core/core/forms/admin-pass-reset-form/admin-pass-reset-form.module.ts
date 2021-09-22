import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '../../../../shared/modules/button/button.module';
import { DialogModule } from '../../../../modules/shared/overlays/dialog/dialog.module';
import { LoaderModule } from '../../../../modules/shared/overlays/loader/loader.module';
import { FormModule } from '../../../../modules/shared/forms/form/form.module';
import { InputTextModule } from '../../../../modules/shared/forms/inputs/input-text/input-text.module';
import { InlineAlertModule } from '../../../../modules/shared/inline-alert/inline-alert.module';

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