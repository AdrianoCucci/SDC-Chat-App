import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatPageRoutingModule } from './chat-page-routing.module';

import { ChatModule } from 'src/app/core/modules/chat/chat.module';
import { LoaderModule } from 'src/app/modules/shared/overlays/loader/loader.module';

import { ChatPage } from './chat-page.component';

@NgModule({
  declarations: [ChatPage],
  imports: [
    CommonModule,
    ChatPageRoutingModule,
    ChatModule,
    LoaderModule
  ]
})
export class ChatPageModule { }