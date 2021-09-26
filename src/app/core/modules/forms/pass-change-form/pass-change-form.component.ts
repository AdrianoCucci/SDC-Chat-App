import { Component, Input, OnInit } from '@angular/core';
import { PassResetRequest } from 'src/app/core/models/auth/pass-reset-request';
import { UsersService } from 'src/app/core/services/api/users-service';
import { AppForm } from '../app-form';

@Component({
  selector: 'app-pass-change-form',
  templateUrl: './pass-change-form.component.html',
  styleUrls: ['./pass-change-form.component.scss']
})
export class PassChangeForm extends AppForm<PassResetRequest, void> {
  @Input() public userId: number;

  constructor(private _usersService: UsersService) {
    super();
  }

  protected async onRequestAdd(model: PassResetRequest): Promise<void> {
    await this.onRequestUpdate(model);
  }

  protected async onRequestUpdate(model: PassResetRequest): Promise<void> {
    await this._usersService.resetPassword(this.userId, model).toPromise();
  }
}