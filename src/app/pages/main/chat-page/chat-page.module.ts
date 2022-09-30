import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatPageRoutingModule } from './chat-page-routing.module';

import { ChatModule } from 'src/app/core/modules/chat/chat.module';

import { ChatPage } from './chat-page.component';

@NgModule({
  declarations: [ChatPage],
  imports: [CommonModule, ChatPageRoutingModule, ChatModule],
})
export class ChatPageModule {}
