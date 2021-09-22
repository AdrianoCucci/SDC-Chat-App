import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'src/app/shared/modules/table/table.module';
import { ButtonModule } from 'src/app/shared/modules/button/button.module';
import { DirectivesModule } from 'src/app/shared/modules/directives/directives-module';
import { DialogModule } from 'src/app/shared/modules/overlays/dialog/dialog.module';
import { LoaderModule } from 'src/app/shared/modules/overlays/loader/loader.module';

import { RoomsTable } from './rooms-table.component';
const component = [RoomsTable];

@NgModule({
  imports: [
    CommonModule,
    TableModule,
    DirectivesModule,
    ButtonModule,
    DialogModule,
    LoaderModule
  ],
  exports: component,
  declarations: component
})
export class RoomsTableModule { }