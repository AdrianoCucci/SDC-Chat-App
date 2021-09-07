import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatPageRoutingModule } from './chat-page-routing.module';

import { ChatModule } from 'src/app/shared/components/chat/chat.module';
import { LoaderModule } from 'src/app/shared/components/loader/loader.module';

import { ChatPageComponent } from './chat-page.component';

@NgModule({
  declarations: [ChatPageComponent],
  imports: [
    CommonModule,
    ChatPageRoutingModule,
    ChatModule,
    LoaderModule
  ]
})
export class ChatPageModule { }