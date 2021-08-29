import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { APP_PATHS } from 'src/app/shared/app-paths';

const PATHS = APP_PATHS.main;
const DEFAULT_PATH: string = PATHS.chat;

const routes: Routes = [
  {
    path: DEFAULT_PATH,
    loadChildren: () => import("./chat-page/chat-page.module").then(m => m.ChatPageModule)
  },
  { path: "", redirectTo: DEFAULT_PATH, pathMatch: "full" },
  { path: "**", redirectTo: DEFAULT_PATH }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }