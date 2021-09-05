import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AUTH_PATHS } from 'src/app/shared/app-paths';

const PATHS = AUTH_PATHS;
const DEFAULT_PATH: string = PATHS.children.login;

const routes: Routes = [
  {
    path: DEFAULT_PATH,
    loadChildren: () => import("./login-page/login-page.module").then(m => m.LoginPageModule)
  },
  { path: "", redirectTo: DEFAULT_PATH, pathMatch: "full" },
  { path: "**", redirectTo: DEFAULT_PATH }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }