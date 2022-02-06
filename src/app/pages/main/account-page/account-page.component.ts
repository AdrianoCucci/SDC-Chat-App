import { Component, ViewChild } from '@angular/core';
import { Role } from 'src/app/core/models/auth/role';
import { Organization } from 'src/app/core/models/organizations/organization';
import { User } from 'src/app/core/models/users/user';
import { AccountForm } from 'src/app/core/modules/forms/account-form/account-form.component';
import { OrganizationForm } from 'src/app/core/modules/forms/organization-form/organization-form.component';
import { PassChangeForm } from 'src/app/core/modules/forms/pass-change-form/pass-change-form.component';
import { LoginService } from 'src/app/core/services/login.service';
import { enumToPairs } from 'src/app/shared/functions/enum-to-pairs';
import { Pair } from 'src/app/shared/models/pair';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPage {
  public readonly rolePairs: Pair<string, Role>[] = enumToPairs(Role, true);

  @ViewChild(AccountForm) private readonly _accountForm: AccountForm;
  @ViewChild(PassChangeForm) private readonly _passChangeForm: PassChangeForm;
  @ViewChild(OrganizationForm) private readonly _organizationForm: OrganizationForm;

  constructor(private _loginService: LoginService) { }

  public getRoleName(role: Role): string {
    return this.rolePairs.find((p: Pair) => p.value === role)?.key ?? null;
  }

  onEditAccount(): void {
    this._accountForm.clear();

    setTimeout(() => {
      this._accountForm.model = { ...this.clientUser };
      this._accountForm.dialogVisible = true;
    });
  }

  onAccountFormSuccess(result: User): void {
    this._accountForm.dialogVisible = false;
    this._loginService.updateCurrentUser(result);
  }

  onEditOrganization(): void {
    this._organizationForm.clear();

    setTimeout(() => {
      this._organizationForm.model = { ...this.organization };
      this._organizationForm.dialogVisible = true;
    });
  }

  onOrganizationFormSuccess(result: Organization): void {
    this._organizationForm.dialogVisible = false;

    this.clientUser.organization = result;
    this._loginService.updateCurrentUser(this.clientUser);
  }

  onChangePassword(): void {
    this._passChangeForm.clear();
    this._passChangeForm.model = null;

    setTimeout(() => {
      this._passChangeForm.model = {
        userId: this.clientUser.id,
        currentPassword: "",
        newPassword: ""
      };

      this._passChangeForm.dialogVisible = true;
    });
  }

  public get clientUser(): User {
    return this._loginService.user;
  }

  public get organization(): Organization {
    return this.clientUser?.organization;
  }

  public get allowEditOrganization(): boolean {
    return this.clientUser?.role === Role.OrganizationAdmin;
  }
}