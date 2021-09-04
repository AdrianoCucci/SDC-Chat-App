import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatPageRoutingModule } from './chat-page-routing.module';

import { ChatModule } from 'src/app/shared/components/chat/chat.module';
import { UsersListModule } from 'src/app/shared/components/users-list/users-list.module';

import { ChatPageComponent } from './chat-page.component';

@NgModule({
  declarations: [ChatPageComponent],
  imports: [
    CommonModule,
    ChatPageRoutingModule,
    ChatModule,
    UsersListModule
  ]
})
export class ChatPageModule { }