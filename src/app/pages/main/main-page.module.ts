import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPageRoutingModule } from './main-page-routing.module';

import { ButtonModule } from 'src/app/shared/components/button/button.module';
import { PopoverModule } from 'src/app/shared/components/popover/popover.module';
import { DialogModule } from 'src/app/shared/components/dialog/dialog.module';

import { MainPage } from './main-page.component';

@NgModule({
  declarations: [MainPage],
  imports: [
    CommonModule,
    MainPageRoutingModule,
    ButtonModule,
    PopoverModule,
    DialogModule
  ]
})
export class MainPageModule { }