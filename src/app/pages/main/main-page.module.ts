import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPageRoutingModule } from './main-page-routing.module';

import { ButtonModule } from 'src/app/shared/modules/button/button.module';
import { TabMenuModule } from 'src/app/shared/modules/menus/tab-menu/tab-menu.module';
import { DialogModule } from 'src/app/shared/modules/overlays/dialog/dialog.module';
import { PopoverModule } from 'src/app/shared/modules/overlays/popover/popover.module';

import { MainPage } from './main-page.component';

@NgModule({
  declarations: [MainPage],
  imports: [
    CommonModule,
    MainPageRoutingModule,
    TabMenuModule,
    ButtonModule,
    PopoverModule,
    DialogModule
  ]
})
export class MainPageModule { }