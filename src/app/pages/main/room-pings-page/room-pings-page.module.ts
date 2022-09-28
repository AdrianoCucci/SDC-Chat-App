import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomPingsPageRoutingModule } from './room-pings-page-routing.module';

import { DirectivesModule } from 'src/app/shared/modules/directives/directives-module';
import { ButtonModule } from 'src/app/shared/modules/button/button.module';
import { RoomPingsModule } from 'src/app/core/modules/room-pings/room-pings.module';
import { FilterListModule } from 'src/app/shared/modules/filter-list/filter-list.module';
import { InputTextModule } from 'src/app/shared/modules/forms/inputs/input-text/input-text.module';

import { RoomPingsPage } from './room-pings-page.component';

@NgModule({
  declarations: [RoomPingsPage],
  imports: [
    CommonModule,
    RoomPingsPageRoutingModule,
    DirectivesModule,
    ButtonModule,
    RoomPingsModule,
    FilterListModule,
    InputTextModule,
  ],
})
export class RoomPingsPageModule {}
