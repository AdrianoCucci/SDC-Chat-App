import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPageRoutingModule } from './main-page-routing.module';

import { TabMenuModule } from 'src/app/shared/components/menus/tab-menu/tab-menu.module';
import { ButtonModule } from 'src/app/shared/components/button/button.module';
import { PopoverModule } from 'src/app/modules/shared/overlays/popover/popover.module';
import { DialogModule } from 'src/app/shared/components/dialog/dialog.module';
import { WebSocketModule } from 'src/app/shared/modules/web-socket.module';

import { MainPage } from './main-page.component';

@NgModule({
  declarations: [MainPage],
  imports: [
    CommonModule,
    MainPageRoutingModule,
    TabMenuModule,
    ButtonModule,
    PopoverModule,
    DialogModule,
    WebSocketModule
  ]
})
export class MainPageModule { }