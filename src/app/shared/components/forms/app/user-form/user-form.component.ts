import { Component } from '@angular/core';
import { User } from 'src/app/core/models/users/user';
import { UserRequest } from 'src/app/core/models/users/user-request';
import { AppForm } from '../app-form';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent extends AppForm<UserRequest, User> {
  protected onRequestAdd(model: UserRequest): Promise<User> {
    throw new Error('Method not implemented.');
  }
  
  protected onRequestUpdate(model: UserRequest): Promise<User> {
    throw new Error('Method not implemented.');
  }
}
