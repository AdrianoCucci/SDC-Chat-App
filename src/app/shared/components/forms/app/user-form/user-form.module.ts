import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { DialogModule } from '../../../dialog/dialog.module';
import { InputTextModule } from '../../inputs/input-text/input-text.module';
import { InputSelectModule } from '../../inputs/input-select/input-select.module';
import { ButtonModule } from '../../../button/button.module';
import { LoaderModule } from '../../../loader/loader.module';

import { UserForm } from './user-form.component';
const component = [UserForm];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    InputSelectModule,
    ButtonModule,
    LoaderModule
  ],
  exports: component,
  declarations: component
})
export class UserFormModule { }