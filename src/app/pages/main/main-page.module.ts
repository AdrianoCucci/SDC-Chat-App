import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPageRoutingModule } from './main-page-routing.module';

import { TabMenuModule } from 'src/app/modules/shared/menus/tab-menu/tab-menu.module';
import { ButtonModule } from 'src/app/modules/shared/button/button.module';
import { PopoverModule } from 'src/app/modules/shared/overlays/popover/popover.module';
import { DialogModule } from 'src/app/modules/shared/overlays/dialog/dialog.module';

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