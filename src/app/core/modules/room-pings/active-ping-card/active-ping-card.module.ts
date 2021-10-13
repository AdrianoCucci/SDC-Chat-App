import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputTextModule } from 'src/app/shared/modules/forms/inputs/input-text/input-text.module';
import { ButtonModule } from 'src/app/shared/modules/button/button.module';

import { ActivePingCard } from './active-ping-card.component';
const component = [ActivePingCard];

@NgModule({
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule
  ],
  exports: component,
  declarations: component
})
export class ActivePingCardModule { }