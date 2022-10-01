import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/core/models/users/user';
import { UserRequest } from 'src/app/core/models/users/user-request';
import { UsersService } from 'src/app/core/services/api/users-service';
import { AppForm } from '../app-form';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss'],
})
export class AccountForm extends AppForm<UserRequest, User> {
  constructor(private _usersService: UsersService) {
    super();
  }

  protected override onRequestAdd(model: UserRequest): Observable<User> {
    return this.onRequestUpdate(model);
  }

  protected override onRequestUpdate(model: UserRequest): Observable<User> {
    return this._usersService
      .updateUser(model.id, model)
      .pipe(map((response: HttpResponse<User>) => response.body));
  }
}
