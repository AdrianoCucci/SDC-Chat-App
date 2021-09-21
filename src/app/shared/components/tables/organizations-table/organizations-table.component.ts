import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { Organization } from 'src/app/core/models/organizations/organization';
import { OrganizationRequest } from 'src/app/core/models/organizations/organization-request';
import { OrganizationsService } from 'src/app/core/services/api/organizations-service';
import { parseHttpError } from 'src/app/shared/functions/parse-http-error';
import { FormMode } from 'src/app/shared/models/form-mode';
import { OrganizationForm } from '../../forms/app/organization-form/organization-form.component';
import { TableCell } from '../table/table-cell';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-organizations-table',
  templateUrl: './organizations-table.component.html',
  styleUrls: ['./organizations-table.component.scss']
})
export class OrganizationsTableComponent {
  @Input() public organizations: Organization[];

  public readonly cells: TableCell[] = [
    { name: "Name", prop: "name", sortable: true, filterable: true },
    { name: "Address", prop: "fullAddress", sortable: true, filterable: true },
    { name: "Email", prop: "email", sortable: true, filterable: true },
    { name: "Phone Number", prop: "phoneNumber", sortable: true, filterable: true }
  ];

  public errorDialogVisible: boolean = false;
  public errorDialogText: string;

  @ViewChild(TableComponent) private readonly _table: TableComponent;
  @ViewChild(OrganizationForm) private readonly _organizationForm: OrganizationForm;

  private _isDeletingOrganization: boolean = false;

  onAddOrganization(): void {
    const request: OrganizationRequest = {} as any;
    this.showOrganizationForm(request, "add");
  }

  onEditOrganization(organization: Organization): void {
    const request: OrganizationRequest = { ...organization };
    this.showOrganizationForm(request, "edit");
  }

  onOrganizationFormSubmit(organization: Organization): void {
    this._organizationForm.dialogVisible = false;

    switch(this._organizationForm.mode) {
      case "add":
        this.organizations = this._table.addRow(organization);
        break;

      case "edit":
        this.organizations = this._table.querySetRow(organization, (u: Organization) => u.id === organization.id);
        break;
    }
  }

  async onDeleteOrganization(organization: Organization): Promise<void> {
    try {
      this._isDeletingOrganization = true;

      await this._orgsService.deleteOrganization(organization.id).toPromise();
      this.organizations = this._table.queryDeleteRow((u: Organization) => u.id === organization.id);
    }
    catch(error) {
      this.errorDialogText = parseHttpError(error as HttpErrorResponse, true) as string;
      this.errorDialogVisible = true;
    }
    finally {
      this._isDeletingOrganization = false;
    }
  }

  private showOrganizationForm(model: OrganizationRequest, mode: FormMode) {
    this._organizationForm.clear();

    setTimeout(() => {
      this._organizationForm.model = model;
      this._organizationForm.mode = mode;
      this._organizationForm.dialogVisible = true;
    });
  }

  constructor(private _orgsService: OrganizationsService) { }

  public get isDeletingOrganization(): boolean {
    return this._isDeletingOrganization;
  }
}