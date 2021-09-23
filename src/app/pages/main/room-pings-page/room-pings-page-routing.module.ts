import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomPingsPage } from './room-pings-page.component';

const routes: Routes = [{ path: "", component: RoomPingsPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomPingsPageRoutingModule { }