import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Role } from 'src/app/core/models/auth/role';
import { APP_PATHS } from 'src/app/shared/app-paths';
import { RoleGuard } from 'src/app/shared/guards/role.guard';
import { MainPage } from './main-page.component';

const PATHS = APP_PATHS.main;
const DEFAULT_PATH: string = PATHS.children.chat;

const routes: Routes = [{
  path: "",
  component: MainPage,
  children: [
    {
      path: PATHS.children.account,
    },
    {
      path: PATHS.children.organizations,
      canActivate: [RoleGuard],
      data: { roles: [Role.Administrator] }
    },
    {
      path: PATHS.children.users,
      canActivate: [RoleGuard],
      data: { roles: [Role.Administrator] }
    },
    {
      path: PATHS.children.rooms,
      canActivate: [RoleGuard],
      data: { roles: [Role.OrganizationAdmin] }
    },
    {
      path: DEFAULT_PATH,
      canActivate: [RoleGuard],
      data: { roles: [Role.OrganizationAdmin, Role.User] },
      loadChildren: () => import("./chat-page/chat-page.module").then(m => m.ChatPageModule)
    },
    {
      path: PATHS.children.pings,
      canActivate: [RoleGuard],
      data: { roles: [Role.OrganizationAdmin, Role.User] }
    },
    { path: "", redirectTo: DEFAULT_PATH, pathMatch: "full" },
    { path: "**", redirectTo: DEFAULT_PATH }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainPageRoutingModule { }