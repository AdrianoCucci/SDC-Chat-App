import { Component } from '@angular/core';
import { faBell, faBuilding, faUniversalAccess, faUser } from '@fortawesome/free-solid-svg-icons';
import { LoginService } from 'src/app/core/services/login.service';
import { ACCOUNT_PATHS } from 'src/app/shared/app-paths';
import { MenuItem } from 'src/app/shared/models/menu-item';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPage {
  public readonly menuItems: MenuItem[];

  constructor(loginService: LoginService) {
    const items: MenuItem[] = [{
      routerLink: `./${ACCOUNT_PATHS.children.details}`,
      label: "Account Details",
      icon: faUser,
      description: "View & manage your account information"
    }];

    if(loginService.user.organization) {
      items.push({
        routerLink: `./${ACCOUNT_PATHS.children.organization}`,
        label: "Organization Details",
        icon: faBuilding,
        description: "View & manage your organization information"
      });
    }

    items.push(
      {
        routerLink: `./${ACCOUNT_PATHS.children.notifications}`,
        label: "Notifications",
        icon: faBell,
        description: "Customize your notification preferences"
      },
      {
        routerLink: `./${ACCOUNT_PATHS.children.accessibility}`,
        label: "Accessibility",
        icon: faUniversalAccess,
        description: "Customize your accessibility preferences"
      }
    );

    this.menuItems = items;
  }

}