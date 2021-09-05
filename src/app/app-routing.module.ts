import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { APP_PATHS } from './shared/app-paths';

const PATHS = APP_PATHS;
const DEFAULT_PATH: string = PATHS.auth.root;

const routes: Routes = [
  {
    path: DEFAULT_PATH,
    loadChildren: () => import("./pages/auth/auth-routing.module").then(m => m.AuthRoutingModule)
  },
  {
    path: PATHS.main.root,
    loadChildren: () => import("./pages/main/main-routing.module").then(m => m.MainRoutingModule)
  },
  { path: "", redirectTo: DEFAULT_PATH, pathMatch: "full" },
  { path: "**", redirectTo: DEFAULT_PATH }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }