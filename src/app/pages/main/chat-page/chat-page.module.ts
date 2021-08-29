import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatPageRoutingModule } from './chat-page-routing.module';
import { ChatPageComponent } from './chat-page.component';
import { ChatService } from 'src/app/core/services/chat.service';

@NgModule({
  declarations: [ChatPageComponent],
  imports: [
    CommonModule,
    ChatPageRoutingModule
  ],
  providers: [ChatService]
})
export class ChatPageModule { }