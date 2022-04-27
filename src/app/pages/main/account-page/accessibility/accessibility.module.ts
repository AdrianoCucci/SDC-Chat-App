import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessibilityRoutingModule } from './accessibility-routing.module';

import { InfoRowModule } from 'src/app/shared/modules/info-row/info-row.module';
import { ButtonModule } from 'src/app/shared/modules/button/button.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InputSelectModule } from 'src/app/shared/modules/forms/inputs/input-select/input-select.module';
import { InputTextModule } from 'src/app/shared/modules/forms/inputs/input-text/input-text.module';
import { LoaderModule } from 'src/app/shared/modules/overlays/loader/loader.module';

import { AccessibilityPage } from './accessibility.page';

@NgModule({
  declarations: [AccessibilityPage],
  imports: [
    CommonModule,
    AccessibilityRoutingModule,
    InfoRowModule,
    ButtonModule,
    InputTextModule,
    InputSelectModule,
    FontAwesomeModule,
    LoaderModule
  ]
})
export class AccessibilityModule { }