import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextareaModule } from '../input/input-textarea/input-textarea.module';

import { ChatService } from 'src/app/core/services/chat.service';

import { ChatWindowComponent } from './chat-window/chat-window.component';
import { ChatMessageComponent } from './chat-message/chat-message.component';

const components = [
  ChatWindowComponent,
  ChatMessageComponent
];

@NgModule({
  imports: [
    CommonModule,
    InputTextareaModule
  ],
  providers: [ChatService],
  exports: components,
  declarations: components
})
export class ChatModule { }