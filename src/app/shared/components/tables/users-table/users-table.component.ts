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
      { header: "Username", value: (u: User) => u.username, sortable: true, filterable: true },
      { header: "Display Name", value: (u: User) => u.displayName, sortable: true, filterable: true },
      { header: "Role", value: (u: User) => u.role, sortable: true, filterable: true, hidden: this.adminFeatures },
      { header: "Is Online", value: (u: User) => u.isOnline, sortable: true, filterable: true, valueType: "boolean" },
      { header: "Organization", value: (u: User) => u.organizationId, sortable: true, filterable: true, hidden: this.adminFeatures }
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