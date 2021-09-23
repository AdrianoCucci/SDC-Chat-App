import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'src/app/shared/modules/button/button.module';
import { FormModule } from 'src/app/shared/modules/forms/form/form.module';
import { DirectivesModule } from 'src/app/shared/modules/directives/directives-module';
import { InputSelectModule } from 'src/app/shared/modules/forms/inputs/input-select/input-select.module';
import { InputTextModule } from 'src/app/shared/modules/forms/inputs/input-text/input-text.module';
import { InputTextareaModule } from 'src/app/shared/modules/forms/inputs/input-textarea/input-textarea.module';
import { InlineAlertModule } from 'src/app/shared/modules/inline-alert/inline-alert.module';
import { DialogModule } from 'src/app/shared/modules/overlays/dialog/dialog.module';
import { LoaderModule } from 'src/app/shared/modules/overlays/loader/loader.module';

import { RoomForm } from './room-form.component';
const component = [RoomForm];

@NgModule({
  imports: [
    CommonModule,
    FormModule,
    DirectivesModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    InputSelectModule,
    ButtonModule,
    LoaderModule,
    InlineAlertModule
  ],
  exports: component,
  declarations: component
})
export class RoomFormModule { }