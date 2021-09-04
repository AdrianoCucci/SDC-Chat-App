import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { ChatMessageComponent } from './chat-message/chat-message.component';

const components = [
  ChatWindowComponent,
  ChatMessageComponent
];

@NgModule({
  imports: [CommonModule],
  exports: components,
  declarations: components
})
export class ChatModule { }