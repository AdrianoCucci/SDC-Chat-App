import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DirectivesModule } from '../../directives/directives-module';

import { TabMenu } from './tab-menu.component';
const component = TabMenu;

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule
  ],
  exports: [component, DirectivesModule],
  declarations: [component]
})
export class TabMenuModule { }