import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomPingCardModule } from './room-ping-card/room-ping-card.module';
import { ActivePingCardModule } from './active-ping-card/active-ping-card.module';

@NgModule({
  imports: [
    CommonModule,
    RoomPingCardModule,
    ActivePingCardModule
  ],
  exports: [
    RoomPingCardModule,
    ActivePingCardModule
  ]
})
export class RoomPingsModule { }