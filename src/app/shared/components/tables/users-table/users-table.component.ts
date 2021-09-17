import { Component, Input, OnInit } from '@angular/core';
import { Role } from 'src/app/core/models/auth/role';
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
  @Input() public adminFeatures: boolean = false;

  public readonly rolesPair: Pair<string, Role>[] = enumToPairs(Role, true);

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
        options: this.rolesPair,
        displayKey: "key",
        valueKey: "value"
      }
    },
    { name: "Is Online", prop: "isOnline", sortable: true, type: "boolean", filterable: true },
    { name: "Organization", prop: "organizationId", sortable: true, filterable: true }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}