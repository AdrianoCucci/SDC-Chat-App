import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsRoutingModule } from './notifications-routing.module';

import { InfoRowModule } from 'src/app/shared/modules/info-row/info-row.module';
import { InputToggleModule } from 'src/app/shared/modules/forms/inputs/input-toggle/input-toggle.module';
import { ButtonModule } from 'src/app/shared/modules/button/button.module';
import { InlineAlertModule } from 'src/app/shared/modules/inline-alert/inline-alert.module';
import { LoaderModule } from 'src/app/shared/modules/overlays/loader/loader.module';

import { NotificationsPage } from './notifications.page';

@NgModule({
  declarations: [NotificationsPage],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    InfoRowModule,
    InputToggleModule,
    ButtonModule,
    InlineAlertModule,
    LoaderModule,
  ],
})
export class NotificationsModule {}
