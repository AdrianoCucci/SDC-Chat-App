import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { DialogModule } from '../../../dialog/dialog.module';
import { InputTextModule } from '../../inputs/input-text/input-text.module';
import { InputSelectModule } from '../../inputs/input-select/input-select.module';
import { InputToggleModule } from '../../inputs/input-toggle/input-toggle.module';
import { LoaderModule } from '../../../loader/loader.module';

import { UserFormComponent } from './user-form.component';
const component = [UserFormComponent];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    InputSelectModule,
    InputToggleModule,
    LoaderModule
  ],
  exports: component,
  declarations: component
})
export class UserFormModule { }