import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PassResetRequest } from 'src/app/core/models/auth/pass-reset-request';
import { AuthService } from 'src/app/core/services/api/auth-service';
import { AppForm } from '../app-form';

@Component({
  selector: 'app-pass-change-form',
  templateUrl: './pass-change-form.component.html',
  styleUrls: ['./pass-change-form.component.scss'],
})
export class PassChangeForm extends AppForm<PassResetRequest, void> {
  constructor(private _authService: AuthService) {
    super();
  }

  protected override onRequestAdd(model: PassResetRequest): Observable<void> {
    return this.onRequestUpdate(model);
  }

  protected override onRequestUpdate(
    model: PassResetRequest
  ): Observable<void> {
    return this._authService.resetPassword(model).pipe(map(() => null));
  }
}
