import { Component, ViewChild } from '@angular/core';
import { Role } from 'src/app/core/models/auth/role';
import { Organization } from 'src/app/core/models/organizations/organization';
import { User } from 'src/app/core/models/users/user';
import { OrganizationForm } from 'src/app/core/modules/forms/organization-form/organization-form.component';
import { LoginService } from 'src/app/core/services/login.service';

@Component({
  selector: 'app-organization-details',
  templateUrl: './organization-details.page.html',
  styleUrls: ['./organization-details.page.scss'],
})
export class OrganizationDetailsPage {
  @ViewChild(OrganizationForm)
  private readonly _organizationForm: OrganizationForm;

  constructor(private _loginService: LoginService) {}

  onEditOrganization(): void {
    this._organizationForm.clear();

    setTimeout(() => {
      this._organizationForm.model = { ...this.organization };
      this._organizationForm.dialogVisible = true;
    });
  }

  onOrganizationFormSuccess(result: Organization): void {
    this._organizationForm.dialogVisible = false;

    this.user.organization = result;
    this._loginService.updateCurrentUser(this.user);
  }

  public get user(): User {
    return this._loginService.user;
  }

  public get organization(): Organization {
    return this.user.organization;
  }

  public get allowEditOrganization(): boolean {
    return this.user.role === Role.OrganizationAdmin;
  }
}
