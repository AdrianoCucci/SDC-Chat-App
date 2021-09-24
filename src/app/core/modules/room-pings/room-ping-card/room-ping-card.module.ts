import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'src/app/shared/modules/button/button.module';

import { RoomPingCard } from './room-ping-card.component';
const component = [RoomPingCard];

@NgModule({
  imports: [
    CommonModule,
    ButtonModule
  ],
  exports: component,
  declarations: component
})
export class RoomPingCardModule { }