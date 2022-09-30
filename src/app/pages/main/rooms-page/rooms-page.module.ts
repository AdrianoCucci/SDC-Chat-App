import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomsPageRoutingModule } from './rooms-page-routing.module';

import { RoomsTableModule } from 'src/app/core/modules/tables/rooms-table/rooms-table.module';
import { ButtonModule } from 'src/app/shared/modules/button/button.module';
import { DialogModule } from 'src/app/shared/modules/overlays/dialog/dialog.module';
import { LoaderModule } from 'src/app/shared/modules/overlays/loader/loader.module';

import { RoomsPage } from './rooms-page.component';

@NgModule({
  declarations: [RoomsPage],
  imports: [
    CommonModule,
    RoomsPageRoutingModule,
    RoomsTableModule,
    LoaderModule,
    DialogModule,
    ButtonModule,
  ],
})
export class RoomsPageModule {}
