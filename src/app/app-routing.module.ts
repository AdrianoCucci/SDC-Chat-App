import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { APP_PATHS } from './shared/app-paths';
import { AuthGuard } from './shared/guards/auth.guard';
import { MainRedirectGuard } from './shared/guards/main-redirect.guard';

const PATHS = APP_PATHS;
const DEFAULT_PATH: string = PATHS.auth.root;

const routes: Routes = [
  {
    path: DEFAULT_PATH,
    canActivate: [MainRedirectGuard],
    loadChildren: () =>
      import('./pages/auth/auth-routing.module').then(
        (m) => m.AuthRoutingModule
      ),
  },
  {
    path: PATHS.main.root,
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/main/main-page.module').then((m) => m.MainPageModule),
  },
  { path: '', redirectTo: DEFAULT_PATH, pathMatch: 'full' },
  { path: '**', redirectTo: DEFAULT_PATH },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
