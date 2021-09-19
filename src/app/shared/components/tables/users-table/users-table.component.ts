import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Role } from 'src/app/core/models/auth/role';
import { Organization } from 'src/app/core/models/organizations/organization';
import { User } from 'src/app/core/models/users/user';
import { UserRequest } from 'src/app/core/models/users/user-request';
import { enumToPairs } from 'src/app/shared/functions/enum-to-pairs';
import { FormMode } from 'src/app/shared/models/form-mode';
import { Pair } from 'src/app/shared/models/pair';
import { UserForm } from '../../forms/app/user-form/user-form.component';
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

  @ViewChild(UserForm) private readonly _userForm: UserForm;

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

  onAddUser(): void {
    const request: UserRequest = {
      username: "",
      password: "",
      role: null,
      isOnline: false
    };

    this.showUserForm(request, "add");
  }

  onEditUser(user: UserRequest): void {
    const request: UserRequest = { ...user };
    this.showUserForm(request, "edit");
  }

  onUserFormSubmit(user: User): void {
    this._userForm.dialogVisible = false;

    switch(this._userForm.mode) {
      case "add":
        if(this.users == null) {
          this.users = [user];
        }
        else {
          this.users.push(user);
        }
        break;

      case "edit":
        const index: number = this.users?.findIndex((u: User) => u.id === user.id) ?? -1;

        if(index !== -1) {
          this.users[index] = user;
        }
        break;
    }
  }

  private showUserForm(model: UserRequest, mode: FormMode) {
    this._userForm.clear();

    setTimeout(() => {
      this._userForm.model = model;
      this._userForm.mode = mode;
      this._userForm.dialogVisible = true;
    });
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