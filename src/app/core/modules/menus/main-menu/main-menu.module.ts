import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabMenuModule } from 'src/app/shared/modules/menus/tab-menu/tab-menu.module';
import { DirectivesModule } from 'src/app/shared/modules/directives/directives-module';

import { MainMenu } from './main-menu.component';
const component = [MainMenu];

@NgModule({
  imports: [
    CommonModule,
    TabMenuModule,
    DirectivesModule
  ],
  exports: component,
  declarations: component
})
export class MainMenuModule { }