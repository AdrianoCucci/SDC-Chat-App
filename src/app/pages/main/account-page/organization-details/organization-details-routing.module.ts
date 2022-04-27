import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationDetailsPage } from './organization-details.page';

const routes: Routes = [{ path: "", component: OrganizationDetailsPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationDetailsRoutingModule { }