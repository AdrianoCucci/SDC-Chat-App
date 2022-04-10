import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessibilityRoutingModule } from './accessibility-routing.module';

import { AccessibilityPage } from './accessibility.page';

@NgModule({
  declarations: [AccessibilityPage],
  imports: [
    CommonModule,
    AccessibilityRoutingModule
  ]
})
export class AccessibilityModule { }