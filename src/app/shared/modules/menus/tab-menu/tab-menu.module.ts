import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MenuButtonModule } from '../menu-button/menu-button.module';
import { DirectivesModule } from '../../directives/directives-module';

import { TabMenu } from './tab-menu.component';
const component = TabMenu;

@NgModule({
  imports: [CommonModule, RouterModule, MenuButtonModule],
  exports: [component, DirectivesModule],
  declarations: [component],
})
export class TabMenuModule {}
