import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPageRoutingModule } from './main-page-routing.module';

import { ButtonModule } from 'src/app/shared/modules/button/button.module';
import { MainMenuModule } from 'src/app/core/modules/menus/main-menu/main-menu.module';
import { TabMenuModule } from 'src/app/shared/modules/menus/tab-menu/tab-menu.module';
import { DialogModule } from 'src/app/shared/modules/overlays/dialog/dialog.module';
import { ConfirmDialogModule } from 'src/app/shared/modules/overlays/dialog/confirm-dialog/confirm-dialog.module';
import { PopoverModule } from 'src/app/shared/modules/overlays/popover/popover.module';
import { LoaderModule } from 'src/app/shared/modules/overlays/loader/loader.module';
import { WebSocketAlertsOverlayModule } from 'src/app/core/modules/overlays/web-socket-alerts/web-socket-alerts-overlay.module';

import { MainPage } from './main-page.component';

@NgModule({
  declarations: [MainPage],
  imports: [
    CommonModule,
    MainPageRoutingModule,
    MainMenuModule,
    TabMenuModule,
    ButtonModule,
    PopoverModule,
    DialogModule,
    ConfirmDialogModule,
    LoaderModule,
    WebSocketAlertsOverlayModule,
  ],
})
export class MainPageModule {}
