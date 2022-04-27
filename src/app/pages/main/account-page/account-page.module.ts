import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountPageRoutingModule } from './account-page-routing.module';

import { TabMenuPanelModule } from 'src/app/shared/modules/menus/tab-menu-panel/tab-menu-panel.module';

import { AccountPage } from './account-page.component';

@NgModule({
  declarations: [AccountPage],
  imports: [
    CommonModule,
    AccountPageRoutingModule,
    TabMenuPanelModule
  ]
})
export class AccountPageModule { }