import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomsPageRoutingModule } from './rooms-page-routing.module';

import { RoomsPage } from './rooms-page.component';

@NgModule({
  declarations: [RoomsPage],
  imports: [
    CommonModule,
    RoomsPageRoutingModule
  ]
})
export class RoomsPageModule { }