import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputTextareaModule } from 'src/app/shared/modules/forms/inputs/input-textarea/input-textarea.module';
import { ButtonModule } from 'src/app/shared/modules/button/button.module';
import { PopoverModule } from 'src/app/shared/modules/overlays/popover/popover.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ChatMessageListComponent } from './chat-message-list/chat-message-list.component';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { UsersListComponent } from './users-list/users-list.component';

const components = [
  ChatMessageListComponent,
  ChatMessageComponent,
  UsersListComponent
];

@NgModule({
  imports: [
    CommonModule,
    InputTextareaModule,
    ButtonModule,
    PopoverModule,
    FontAwesomeModule
  ],
  exports: components,
  declarations: components
})
export class ChatModule { }