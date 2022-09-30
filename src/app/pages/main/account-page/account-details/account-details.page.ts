import { Component, ViewChild } from '@angular/core';
import { Role } from 'src/app/core/models/auth/role';
import { User } from 'src/app/core/models/users/user';
import { AccountForm } from 'src/app/core/modules/forms/account-form/account-form.component';
import { PassChangeForm } from 'src/app/core/modules/forms/pass-change-form/pass-change-form.component';
import { LoginService } from 'src/app/core/services/login.service';
import { enumToPairs } from 'src/app/shared/functions/enum-to-pairs';
import { Pair } from 'src/app/shared/models/pair';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.page.html',
  styleUrls: ['./account-details.page.scss'],
})
export class AccountDetailsPage {
  public readonly rolePairs: Pair<string, Role>[] = enumToPairs(Role, true);

  @ViewChild(AccountForm) private readonly _accountForm: AccountForm;
  @ViewChild(PassChangeForm) private readonly _passChangeForm: PassChangeForm;

  constructor(private _loginService: LoginService) {}

  public getUserRoleDisplay() {
    return (
      this.rolePairs.find((p: Pair) => p.value === this.user.role)?.key ??
      undefined
    );
  }

  onEditAccount(): void {
    this._accountForm.clear();

    setTimeout(() => {
      this._accountForm.model = { ...this.user };
      this._accountForm.dialogVisible = true;
    });
  }

  onAccountFormSuccess(result: User): void {
    this._accountForm.dialogVisible = false;
    this._loginService.updateCurrentUser(result);
  }

  onChangePassword(): void {
    this._passChangeForm.clear();
    this._passChangeForm.model = null;

    setTimeout(() => {
      this._passChangeForm.model = {
        userId: this.user.id,
        currentPassword: '',
        newPassword: '',
      };

      this._passChangeForm.dialogVisible = true;
    });
  }

  public get user(): User {
    return this._loginService.user;
  }
}
