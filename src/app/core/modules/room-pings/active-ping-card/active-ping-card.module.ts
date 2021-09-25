import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'src/app/shared/modules/button/button.module';

import { ActivePingCard } from './active-ping-card.component';
const component = [ActivePingCard];

@NgModule({
  imports: [
    CommonModule,
    ButtonModule
  ],
  exports: component,
  declarations: component
})
export class ActivePingCardModule { }