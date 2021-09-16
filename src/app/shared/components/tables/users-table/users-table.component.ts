import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/core/models/users/user';
import { TableConfig } from '../table/table-config';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit {
  @Input() public adminFeatures: boolean = false;

  public readonly tableConfig = new TableConfig<User>({
    dataKey: "id",
    cells: [
      { header: "Username", valueField: "username", sortable: true, filterable: true },
      { header: "Display Name", valueField: "displayName", sortable: true, filterable: true },
      { header: "Role", valueField: "role", sortable: true, filterable: true, hidden: this.adminFeatures },
      { header: "Is Online", valueField: "isOnline", sortable: true, filterable: true, valueType: "boolean" },
      { header: "Organization", valueField: "organizationId", sortable: true, filterable: true, hidden: this.adminFeatures }
    ]
  });

  constructor() { }

  ngOnInit(): void {
  }

  public get users(): User[] {
    return this.tableConfig.data;
  }

  @Input() public set users(value: User[]) {
    this.tableConfig.setData(value);
  }
}