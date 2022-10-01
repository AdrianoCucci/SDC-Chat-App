import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  protected override onRequestAdd(
    model: OrganizationRequest
  ): Observable<Organization> {
    return this._orgsService
      .addOrganization(model)
      .pipe(map((response: HttpResponse<Organization>) => response.body));
  }

  protected override onRequestUpdate(
    model: OrganizationRequest
  ): Observable<Organization> {
    return this._orgsService
      .updateOrganization(model.id, model)
      .pipe(map((response: HttpResponse<Organization>) => response.body));
  }
}
