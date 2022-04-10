import { Component, OnInit, ViewChild } from '@angular/core';
import { Role } from 'src/app/core/models/auth/role';
import { Organization } from 'src/app/core/models/organizations/organization';
import { NotificationPrefs } from 'src/app/core/models/user-prefs/notification-prefs.model';
import { User } from 'src/app/core/models/users/user';
import { AccountForm } from 'src/app/core/modules/forms/account-form/account-form.component';
import { OrganizationForm } from 'src/app/core/modules/forms/organization-form/organization-form.component';
import { PassChangeForm } from 'src/app/core/modules/forms/pass-change-form/pass-change-form.component';
import { LoginService } from 'src/app/core/services/login.service';
import { EventNotificationsService } from 'src/app/core/services/notifications/event-notifications-service';
import { SwNotificationsService } from 'src/app/core/services/notifications/sw-notifications.service';
import { UserPrefsService } from 'src/app/core/services/user-prefs.service';
import { enumToPairs } from 'src/app/shared/functions/enum-to-pairs';
import { Pair } from 'src/app/shared/models/pair';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPage implements OnInit {
  public readonly rolePairs: Pair<string, Role>[] = enumToPairs(Role, true);
  public readonly notificationPrefs: NotificationPrefs = {};

  @ViewChild(AccountForm) private readonly _accountForm: AccountForm;
  @ViewChild(PassChangeForm) private readonly _passChangeForm: PassChangeForm;
  @ViewChild(OrganizationForm) private readonly _organizationForm: OrganizationForm;

  private readonly _notificationsPrefsKey: string = "notifications";

  constructor(
    private _loginService: LoginService,
    private _userPrefsService: UserPrefsService,
    private _notificationsService: SwNotificationsService,
    private _eventNotificationsService: EventNotificationsService
  ) { }

  ngOnInit(): void {
    this.loadNotificationPrefs();
  }

  private loadNotificationPrefs(): void {
    const prefs: NotificationPrefs = this._userPrefsService.getPreference(this._notificationsPrefsKey);

    if(prefs) {
      Object.assign(this.notificationPrefs, prefs);
    }
  }

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

  onRequestNotificationsPermission(): void {
    this._notificationsService.requestPermission();
  }

  async onSaveNotificationPrefs(): Promise<void> {
    await this._userPrefsService.setPreference(this._notificationsPrefsKey, this.notificationPrefs);
    this._eventNotificationsService.registerEvents();
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

  public get hasNotificationsPermission(): boolean {
    return this._notificationsService.hasPermission;
  }
}