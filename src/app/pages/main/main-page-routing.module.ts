import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Role } from 'src/app/core/models/auth/role';
import { APP_PATHS } from 'src/app/shared/app-paths';
import { RoleGuard } from 'src/app/shared/guards/role.guard';
import { MainPage } from './main-page.component';

const PATHS = APP_PATHS.main;

const routes: Routes = [
  {
    path: "",
    component: MainPage,
    children: [
      {
        path: PATHS.children.account,
        loadChildren: () => import("./account-page/account-page.module").then(m => m.AccountPageModule)
      },
      {
        path: PATHS.children.organizations,
        canActivate: [RoleGuard],
        data: { roles: [Role.Administrator] },
        loadChildren: () => import("./organizations-page/organizations-page.module").then(m => m.OrganizationsPageModule)
      },
      {
        path: PATHS.children.users,
        canActivate: [RoleGuard],
        data: { roles: [Role.Administrator, Role.OrganizationAdmin] },
        loadChildren: () => import("./users-page/users-page.module").then(m => m.UsersPageModule)
      },
      {
        path: PATHS.children.rooms,
        canActivate: [RoleGuard],
        data: { roles: [Role.OrganizationAdmin] },
        loadChildren: () => import("./rooms-page/rooms-page.module").then(m => m.RoomsPageModule)
      },
      {
        path: PATHS.children.chat,
        canActivate: [RoleGuard],
        data: { roles: [Role.OrganizationAdmin, Role.User] },
        loadChildren: () => import("./chat-page/chat-page.module").then(m => m.ChatPageModule)
      },
      {
        path: PATHS.children.pings,
        canActivate: [RoleGuard],
        data: { roles: [Role.OrganizationAdmin, Role.User] },
        loadChildren: () => import("./room-pings-page/room-pings-page.module").then(m => m.RoomPingsPageModule)
      }
    ]
  },
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainPageRoutingModule { }