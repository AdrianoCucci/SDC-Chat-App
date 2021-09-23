import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomPingsPageRoutingModule } from './room-pings-page-routing.module';

import { RoomPingsPage } from './room-pings-page.component';

@NgModule({
  declarations: [RoomPingsPage],
  imports: [
    CommonModule,
    RoomPingsPageRoutingModule
  ]
})
export class RoomPingsPageModule { }