import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextareaModule } from '../forms/inputs/input-textarea/input-textarea.module';

import { ChatWindowComponent } from './chat-window/chat-window.component';
import { ChatMessageListComponent } from './chat-message-list/chat-message-list.component';
import { ChatMessageComponent } from './chat-message/chat-message.component';

import { ChatService } from 'src/app/core/services/chat.service';
import { UsersListComponent } from './users-list/users-list.component';

const components = [
  ChatWindowComponent,
  ChatMessageListComponent,
  ChatMessageComponent,
  UsersListComponent
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