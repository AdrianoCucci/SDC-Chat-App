import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'src/app/shared/modules/table/table.module';
import { RoomFormModule } from '../../forms/room-form/room-form.module';
import { ButtonModule } from 'src/app/shared/modules/button/button.module';
import { DirectivesModule } from 'src/app/shared/modules/directives/directives-module';
import { ConfirmDialogModule } from 'src/app/shared/modules/overlays/dialog/confirm-dialog/confirm-dialog.module';
import { LoaderModule } from 'src/app/shared/modules/overlays/loader/loader.module';

import { RoomsTable } from './rooms-table.component';
const component = [RoomsTable];

@NgModule({
  imports: [
    CommonModule,
    TableModule,
    RoomFormModule,
    DirectivesModule,
    ButtonModule,
    ConfirmDialogModule,
    LoaderModule
  ],
  exports: component,
  declarations: component
})
export class RoomsTableModule { }