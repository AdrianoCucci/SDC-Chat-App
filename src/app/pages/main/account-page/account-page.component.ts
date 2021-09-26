import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Role } from 'src/app/core/models/auth/role';
import { Organization } from 'src/app/core/models/organizations/organization';
import { User } from 'src/app/core/models/users/user';
import { AccountForm } from 'src/app/core/modules/forms/account-form/account-form.component';
import { PassChangeForm } from 'src/app/core/modules/forms/pass-change-form/pass-change-form.component';
import { OrganizationsService } from 'src/app/core/services/api/organizations-service';
import { LoginService } from 'src/app/core/services/login.service';
import { enumToPairs } from 'src/app/shared/functions/enum-to-pairs';
import { Pair } from 'src/app/shared/models/pair';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPage implements OnInit {
  public readonly rolePairs: Pair<string, Role>[] = enumToPairs(Role, true);

  @ViewChild(AccountForm) private readonly _accountForm: AccountForm;
  @ViewChild(PassChangeForm) private readonly _passChangeForm: PassChangeForm;

  private _organization: Organization;
  private _loadingVisible: boolean = false;

  constructor(private _loginService: LoginService, private _orgsService: OrganizationsService) { }

  public getRoleName(role: Role): string {
    return this.rolePairs.find((p: Pair) => p.value === role)?.key ?? null;
  }

  async ngOnInit(): Promise<void> {
    if(this.clientUser.organizationId != null) {
      try {
        this._loadingVisible = true;
        this._organization = await this.loadOrganization(this.clientUser.organizationId);
      }
      catch(error) {
        console.error(error);
      }
      finally {
        this._loadingVisible = false;
      }
    }
  }

  private loadOrganization(id: number): Promise<Organization> {
    return new Promise<Organization>(async (resolve, reject) => {
      try {
        const response: HttpResponse<Organization> = await this._orgsService.getOrganization(id).toPromise();
        resolve(response.body);
      }
      catch(error) {
        reject(error);
      }
    });
  }

  onEditAccount(): void {
    this._accountForm.clear();

    setTimeout(() => {
      this._accountForm.model = { ...this.clientUser } as any;
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
      this._passChangeForm.model = { currentPassword: "", newPassword: "" };
      this._passChangeForm.dialogVisible = true;
    });
  }

  public get clientUser(): User {
    return this._loginService.user;
  }

  public get organization(): Organization {
    return this._organization;
  }

  public get loadingVisible(): boolean {
    return this._loadingVisible;
  }
}