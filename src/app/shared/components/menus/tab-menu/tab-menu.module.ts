import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TabMenu } from './tab-menu.component';
const component = [TabMenu];

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: component,
  declarations: component
})
export class TabMenuModule { }