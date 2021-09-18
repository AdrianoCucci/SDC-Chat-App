import { Component, Input } from '@angular/core';
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
export class UsersTableComponent {
  @Input() public users: User[];
  @Input() public adminFeatures: boolean = false;

  public readonly rolePairs: Pair<string, Role>[] = enumToPairs(Role, true);

  private readonly _organizationCell: TableCell = {
    name: "Organization",
    prop: "organizationId",
    sortable: true,
    filterable: true,
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

  private _organizations: Organization[];

  public getRoleName(role: Role): string {
    return this.rolePairs.find((p: Pair<string, Role>) => p.value === role)?.key ?? '-';
  }

  public getOrganizationName(organizationId: number): string {
    return this._organizations?.find((o: Organization) => o.id === organizationId)?.name ?? '-';
  }

  public get organizations(): Organization[] {
    return this._organizations;
  }
  @Input() public set organizations(value: Organization[]) {
    this._organizations = value;
    this._organizationCell.selectOptions.options = this._organizations;
  }
}