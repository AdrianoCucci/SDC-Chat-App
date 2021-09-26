import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { User } from 'src/app/core/models/users/user';
import { UserRequest } from 'src/app/core/models/users/user-request';
import { UsersService } from 'src/app/core/services/api/users-service';
import { AppForm } from '../app-form';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss']
})
export class AccountForm extends AppForm<UserRequest, User> {
  constructor(private _usersService: UsersService) { 
    super();
  }

  protected async onRequestAdd(model: UserRequest): Promise<User> {
    return await this.onRequestUpdate(model);
  }

  protected async onRequestUpdate(model: UserRequest): Promise<User> {
    const response: HttpResponse<User> = await this._usersService.updateUser(model.id, model).toPromise();
    return response.body;
  }
}