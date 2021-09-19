import { Component, Input } from '@angular/core';
import { AdminPassResetRequest } from 'src/app/core/models/auth/admin-pass-reset-request';
import { User } from 'src/app/core/models/users/user';
import { UsersService } from 'src/app/core/services/api/users-service';
import { AppForm } from '../app-form';

@Component({
  selector: 'app-admin-pass-reset-form',
  templateUrl: './admin-pass-reset-form.component.html',
  styleUrls: ['./admin-pass-reset-form.component.scss']
})
export class AdminPassResetForm extends AppForm<AdminPassResetRequest, void> {
  @Input() public user: User;

  constructor(private _usersService: UsersService) {
    super();
  }

  protected async onRequestAdd(model: AdminPassResetRequest): Promise<void> {
    await this._usersService.adminResetPassword(this.user?.id, model).toPromise();
  }

  protected async onRequestUpdate(model: AdminPassResetRequest): Promise<void> {
    return await this.onRequestAdd(model);
  }
}