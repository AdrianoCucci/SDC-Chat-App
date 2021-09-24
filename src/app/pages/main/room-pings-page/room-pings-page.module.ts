import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomPingsPageRoutingModule } from './room-pings-page-routing.module';

import { ButtonModule } from 'src/app/shared/modules/button/button.module';

import { RoomPingsPage } from './room-pings-page.component';
import { RoomPingsModule } from 'src/app/core/modules/room-pings/room-pings.module';

@NgModule({
  declarations: [RoomPingsPage],
  imports: [
    CommonModule,
    RoomPingsPageRoutingModule,
    ButtonModule,
    RoomPingsModule
  ]
})
export class RoomPingsPageModule { }