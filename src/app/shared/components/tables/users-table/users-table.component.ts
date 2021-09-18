import { Component, Input, OnInit } from '@angular/core';
import { Role } from 'src/app/core/models/auth/role';
import { Organization } from 'src/app/core/models/organizations/organization';
import { User } from 'src/app/core/models/users/user';
import { enumToPairs } from 'src/app/shared/functions/enum-to-pairs';
import { Pair } from 'src/app/shared/models/pair';
import { TableCell } from '../table/table-cell';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit {
  @Input() public users: User[];
  @Input() public clientUser: User;

  public readonly rolePairs: Pair<string, Role>[] = enumToPairs(Role, true);

  private readonly _organizationCell: TableCell = {
    name: "Organization",
    prop: "organizationId",
    sortable: true,
    filterable: true,
    cellClass: "admin-cell",
    type: "select",
    selectOptions: {
      displayKey: "name",
      valueKey: "id"
    }
  };

  public readonly cells: TableCell[] = [
    { name: "Username", prop: "username", sortable: true, filterable: true },
    { name: "Display Name", prop: "displayName", sortable: true, filterable: true },
    {
      name: "Role",
      prop: "role",
      sortable: true,
      filterable: true,
      cellClass: "admin-cell",
      type: "select",
      selectOptions: {
        options: this.rolePairs,
        displayKey: "key",
        valueKey: "value"
      }
    },
    { name: "Is Online", prop: "isOnline", sortable: true, type: "boolean", filterable: true },
    this._organizationCell
  ];

  private _adminFeatures: boolean = false;
  private _organizations: Organization[];

  ngOnInit(): void {
    this.setAdminCellsHidden(!this._adminFeatures);
  }

  public isClientUser(user: User): boolean {
    return this.clientUser?.id === user?.id;
  }

  public getRoleName(role: Role): string {
    return this.rolePairs.find((p: Pair<string, Role>) => p.value === role)?.key ?? '-';
  }

  public getOrganizationName(organizationId: number): string {
    return this._organizations?.find((o: Organization) => o.id === organizationId)?.name ?? '-';
  }

  private setAdminCellsHidden(hidden: boolean) {
    for(let i = 0; i < this.cells.length; i++) {
      const cell: TableCell = this.cells[i];

      if(cell.cellClass === "admin-cell") {
        cell.hidden = hidden;
      }
    }
  }

  public get adminFeatures(): boolean {
    return this._adminFeatures;
  }
  @Input() public set adminFeatures(value: boolean) {
    this._adminFeatures = value;
    this.setAdminCellsHidden(!this._adminFeatures);
  }

  public get organizations(): Organization[] {
    return this._organizations;
  }
  @Input() public set organizations(value: Organization[]) {
    this._organizations = value;
    this._organizationCell.selectOptions.options = this._organizations;
  }
}