import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Organization } from 'src/app/core/models/organizations/organization';
import { OrganizationRequest } from 'src/app/core/models/organizations/organization-request';
import { OrganizationsService } from 'src/app/core/services/api/organizations-service';
import { AppForm } from '../app-form';

@Component({
  selector: 'app-organization-form',
  templateUrl: './organization-form.component.html',
  styleUrls: ['./organization-form.component.scss'],
})
export class OrganizationForm extends AppForm<
  OrganizationRequest,
  Organization
> {
  constructor(private _orgsService: OrganizationsService) {
    super();
  }

  protected async onRequestAdd(
    model: OrganizationRequest
  ): Promise<Organization> {
    const response: HttpResponse<Organization> = await this._orgsService
      .addOrganization(model)
      .toPromise();
    return response.body;
  }

  protected async onRequestUpdate(
    model: OrganizationRequest
  ): Promise<Organization> {
    const response: HttpResponse<Organization> = await this._orgsService
      .updateOrganization(model.id, model)
      .toPromise();
    return response.body;
  }
}
