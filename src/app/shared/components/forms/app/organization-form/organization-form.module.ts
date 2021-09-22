import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from '../../../../../modules/shared/button/button.module';
import { DialogModule } from '../../../../../modules/shared/overlays/dialog/dialog.module';
import { InlineAlertModule } from '../../../inline-alert/inline-alert.module';
import { LoaderModule } from '../../../../../modules/shared/overlays/loader/loader.module';
import { FormModule } from '../../../../../modules/shared/forms/form/form.module';
import { InputTextModule } from '../../../../../modules/shared/forms/inputs/input-text/input-text.module';

import { OrganizationForm } from './organization-form.component';
const component = [OrganizationForm];

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
export class OrganizationFormModule { }