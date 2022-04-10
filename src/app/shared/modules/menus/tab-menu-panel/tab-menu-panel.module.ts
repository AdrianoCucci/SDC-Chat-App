import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MenuButtonModule } from '../menu-button/menu-button.module';

import { TabMenuPanelComponent } from './tab-menu-panel.component';
const component = [TabMenuPanelComponent];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MenuButtonModule
  ],
  exports: component,
  declarations: component
})
export class TabMenuPanelModule { }