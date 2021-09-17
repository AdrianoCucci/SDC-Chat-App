import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/core/models/users/user';
import { TableCell } from '../table/table-cell';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit {
  @Input() public users: User[];
  @Input() public adminFeatures: boolean = false;

  public readonly cells: TableCell[] = [
    { name: "Username", prop: "username", sortable: true },
    { name: "Display Name", prop: "displayName", sortable: true },
    { name: "Role", prop: "role", sortable: true },
    { name: "Is Online", prop: "isOnline", sortable: true, type: "boolean" },
    { name: "Organization", prop: "organizationId", sortable: true }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}