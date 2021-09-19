import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '../../../button/button.module';
import { DialogModule } from '../../../dialog/dialog.module';
import { LoaderModule } from '../../../loader/loader.module';
import { FormModule } from '../../form/form.module';
import { InputTextModule } from '../../inputs/input-text/input-text.module';

import { AdminPassResetForm } from './admin-pass-reset-form.component';
const component = [AdminPassResetForm];

@NgModule({
  imports: [
    CommonModule,
    FormModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    LoaderModule
  ],
  exports: component,
  declarations: component
})
export class AdminPassResetFormModule { }