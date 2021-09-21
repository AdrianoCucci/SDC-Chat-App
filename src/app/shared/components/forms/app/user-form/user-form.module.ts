import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormModule } from '../../form/form.module';
import { DialogModule } from '../../../dialog/dialog.module';
import { InputTextModule } from '../../inputs/input-text/input-text.module';
import { InputSelectModule } from '../../inputs/input-select/input-select.module';
import { ButtonModule } from '../../../button/button.module';
import { LoaderModule } from '../../../loader/loader.module';
import { InlineAlertModule } from '../../../inline-alert/inline-alert.module';

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