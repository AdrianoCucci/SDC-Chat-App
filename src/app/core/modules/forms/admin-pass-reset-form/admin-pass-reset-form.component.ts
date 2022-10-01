import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdminPassResetRequest } from 'src/app/core/models/auth/admin-pass-reset-request';
import { User } from 'src/app/core/models/users/user';
import { AuthService } from 'src/app/core/services/api/auth-service';
import { AppForm } from '../app-form';

@Component({
  selector: 'app-admin-pass-reset-form',
  templateUrl: './admin-pass-reset-form.component.html',
  styleUrls: ['./admin-pass-reset-form.component.scss'],
})
export class AdminPassResetForm extends AppForm<AdminPassResetRequest, void> {
  @Input() public user: User;

  constructor(private _authService: AuthService) {
    super();
  }

  protected override onRequestAdd(
    model: AdminPassResetRequest
  ): Observable<void> {
    return this.onRequestUpdate(model);
  }

  protected override onRequestUpdate(
    model: AdminPassResetRequest
  ): Observable<void> {
    return this._authService.adminResetPassword(model).pipe(map(() => null));
  }
}
