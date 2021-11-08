import { Component } from '@angular/core';
import { PassResetRequest } from 'src/app/core/models/auth/pass-reset-request';
import { AuthService } from 'src/app/core/services/api/auth-service';
import { AppForm } from '../app-form';

@Component({
  selector: 'app-pass-change-form',
  templateUrl: './pass-change-form.component.html',
  styleUrls: ['./pass-change-form.component.scss']
})
export class PassChangeForm extends AppForm<PassResetRequest, void> {
  constructor(private _authService: AuthService) {
    super();
  }

  protected async onRequestAdd(model: PassResetRequest): Promise<void> {
    await this.onRequestUpdate(model);
  }

  protected async onRequestUpdate(model: PassResetRequest): Promise<void> {
    await this._authService.resetPassword(model).toPromise();
  }
}