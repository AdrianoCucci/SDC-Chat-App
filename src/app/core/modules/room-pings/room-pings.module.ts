import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomPingCardModule } from './room-ping-card/room-ping-card.module';

@NgModule({
  imports: [
    CommonModule,
    RoomPingCardModule
  ],
  exports: [RoomPingCardModule]
})
export class RoomPingsModule { }