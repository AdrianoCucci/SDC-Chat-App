import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputTextareaModule } from '../../../modules/shared/forms/inputs/input-textarea/input-textarea.module';
import { WebSocketModule } from '../../../shared/modules/web-socket.module';

import { ChatWindowComponent } from './chat-window/chat-window.component';
import { ChatMessageListComponent } from './chat-message-list/chat-message-list.component';
import { ChatMessageComponent } from './chat-message/chat-message.component';
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
  exports: components,
  declarations: components
})
export class ChatModule { }