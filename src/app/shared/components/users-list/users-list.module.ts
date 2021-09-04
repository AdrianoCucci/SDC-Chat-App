import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersList } from './users-list.component';

const component = [UsersList];

@NgModule({
  imports: [CommonModule],
  exports: component,
  declarations: component
})
export class UsersListModule { }