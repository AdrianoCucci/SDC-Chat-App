import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationsPage } from './organizations-page.component';

const routes: Routes = [{ path: '', component: OrganizationsPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationsPageRoutingModule {}
