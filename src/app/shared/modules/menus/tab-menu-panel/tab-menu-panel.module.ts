import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TabMenuModule } from '../tab-menu/tab-menu.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { TabMenuPanelComponent } from './tab-menu-panel.component';
const component = [TabMenuPanelComponent];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TabMenuModule,
    FontAwesomeModule
  ],
  exports: component,
  declarations: component
})
export class TabMenuPanelModule { }