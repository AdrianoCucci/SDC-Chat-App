import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ACCOUNT_PATHS } from 'src/app/shared/app-paths';
import { AccountPage } from './account-page.component';

const PATHS = ACCOUNT_PATHS.children;
const DEFAULT_PATH: string = PATHS.details;

const routes: Routes = [
  {
    path: '',
    component: AccountPage,
    children: [
      {
        path: DEFAULT_PATH,
        loadChildren: () =>
          import('./account-details/account-details.module').then(
            (m) => m.AccountDetailsModule
          ),
      },
      {
        path: PATHS.organization,
        loadChildren: () =>
          import('./organization-details/organization-details.module').then(
            (m) => m.OrganizationDetailsModule
          ),
      },
      {
        path: PATHS.notifications,
        loadChildren: () =>
          import('./notifications/notifications.module').then(
            (m) => m.NotificationsModule
          ),
      },
      {
        path: PATHS.accessibility,
        loadChildren: () =>
          import('./accessibility/accessibility.module').then(
            (m) => m.AccessibilityModule
          ),
      },
      { path: '**', pathMatch: 'full', redirectTo: DEFAULT_PATH },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountPageRoutingModule {}
