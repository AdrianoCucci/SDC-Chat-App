import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Role } from 'src/app/core/models/auth/role';
import { Organization } from 'src/app/core/models/organizations/organization';
import { User } from 'src/app/core/models/users/user';
import { UserRequest } from 'src/app/core/models/users/user-request';
import { UsersService } from 'src/app/core/services/api/users-service';
import { UserForm } from 'src/app/core/modules/forms/user-form/user-form.component';
import { enumToPairs } from 'src/app/shared/functions/enum-to-pairs';
import { parseErrorMessage } from 'src/app/shared/functions/parse-http-error';
import { FormMode } from 'src/app/shared/models/form-mode';
import { Pair } from 'src/app/shared/models/pair';
import { AdminPassResetForm } from '../../forms/admin-pass-reset-form/admin-pass-reset-form.component';
import { TableCell } from 'src/app/shared/modules/table/table-cell';
import { Table } from 'src/app/shared/modules/table/table.component';
import { PageEvent } from 'src/app/shared/modules/table/page-event';
import { PagedList } from 'src/app/shared/models/pagination/paged-list';
import { Observable, defer, throwError } from 'rxjs';
import { finalize, catchError, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
})
export class UsersTable implements OnInit {
  @Input() public users: User[];
  @Input() public clientUser: User;
  @Input() public pageHandler: (
    event: PageEvent
  ) => Observable<PagedList<User>>;

  private readonly _roleCell: TableCell = {
    name: 'Role',
    prop: 'role',
    sortable: true,
    filterable: true,
    type: 'select',
    selectOptions: {
      options: [],
      displayKey: 'key',
      valueKey: 'value',
    },
  };

  private readonly _organizationCell: TableCell = {
    name: 'Organization',
    prop: 'organizationId',
    sortable: true,
    filterable: true,
    cellClass: 'admin-cell',
    type: 'select',
    selectOptions: {
      displayKey: 'name',
      valueKey: 'id',
    },
  };

  public readonly cells: TableCell[] = [
    { name: 'Username', prop: 'username', sortable: true, filterable: true },
    {
      name: 'Display Name',
      prop: 'displayName',
      sortable: true,
      filterable: true,
    },
    this._roleCell,
    this._organizationCell,
    {
      name: 'Account Locked',
      prop: 'isLocked',
      sortable: true,
      type: 'boolean',
      filterable: true,
    },
  ];

  public errorDialogVisible: boolean = false;
  public errorDialogText: string;

  @ViewChild(Table) private readonly _table: Table;
  @ViewChild(AdminPassResetForm)
  private readonly _passResetForm: AdminPassResetForm;
  @ViewChild(UserForm) private readonly _userForm: UserForm;

  private _adminFeatures: boolean = false;
  private _organizations: Organization[];
  private _isDeletingUser: boolean = false;

  constructor(private _usersService: UsersService) {}

  ngOnInit(): void {
    this.updateAdminState(this._adminFeatures);
  }

  public isClientUser(user: User): boolean {
    return this.clientUser?.id === user?.id;
  }

  public getRoleName(role: Role): string {
    return (
      this.rolePairs.find((p: Pair<string, Role>) => p.value === role)?.key ??
      '-'
    );
  }

  public getOrganizationName(organizationId: number): string {
    return (
      this._organizations?.find((o: Organization) => o.id === organizationId)
        ?.name ?? '-'
    );
  }

  private updateAdminState(allowAdminFeatures: boolean): void {
    this.setAdminCellsHidden(!allowAdminFeatures);
    this._roleCell.selectOptions.options =
      this.getRolePairs(allowAdminFeatures);
  }

  private setAdminCellsHidden(hidden: boolean) {
    for (let i = 0; i < this.cells.length; i++) {
      const cell: TableCell = this.cells[i];

      if (cell.cellClass === 'admin-cell') {
        cell.hidden = hidden;
      }
    }
  }

  private getRolePairs(allowAdminFeatures: boolean): Pair<string, Role>[] {
    const pairs: Pair<string, Role>[] = enumToPairs(Role, true);

    if (!allowAdminFeatures) {
      const adminIndex: number = pairs.findIndex(
        (p: Pair) => p.value === Role.Administrator
      );

      if (adminIndex !== -1) {
        pairs.splice(adminIndex, 1);
      }
    }

    return pairs;
  }

  onResetUserPassword(user: User): void {
    this._passResetForm.clear();

    setTimeout(() => {
      this._passResetForm.user = user;
      this._passResetForm.model = { userId: user.id, newPassword: '' };
      this._passResetForm.dialogVisible = true;
    });
  }

  onAddUser(): void {
    const request: UserRequest = {
      username: '',
      password: '',
      role: this._adminFeatures ? null : Role.User,
    };

    this.showUserForm(request, 'add');
  }

  onEditUser(user: UserRequest): void {
    const request: UserRequest = { ...user };
    this.showUserForm(request, 'edit');
  }

  onUserFormSubmit(user: User): void {
    this._userForm.dialogVisible = false;

    switch (this._userForm.mode) {
      case 'add':
        this.users = this._table.addRow(user);
        break;

      case 'edit':
        this.users = this._table.querySetRow(
          user,
          (u: User) => u.id === user.id
        );
        break;
    }
  }

  onDeleteUser(user: User): void {
    this.deleteUser(user).subscribe();
  }

  private showUserForm(model: UserRequest, mode: FormMode) {
    this._userForm.clear();

    setTimeout(() => {
      this._userForm.model = model;
      this._userForm.mode = mode;
      this._userForm.dialogVisible = true;
    });
  }

  private deleteUser(user: User): Observable<void> {
    return defer((): Observable<void> => {
      this._isDeletingUser = true;

      return this._usersService.deleteUser(user.id).pipe(
        finalize(() => (this._isDeletingUser = false)),
        catchError((error: any) => {
          this.errorDialogText = parseErrorMessage(error);
          this.errorDialogVisible = true;
          return throwError(error);
        }),
        map(() => null),
        tap(() => {
          this.users = this._table.queryDeleteRow(
            (r: User) => r.id === user.id
          );
        })
      );
    });
  }

  public get adminFeatures(): boolean {
    return this._adminFeatures;
  }
  @Input() public set adminFeatures(value: boolean) {
    this._adminFeatures = value;
    this.updateAdminState(this._adminFeatures);
  }

  public get rolePairs(): Pair<string, Role>[] {
    return this._roleCell.selectOptions.options;
  }

  public get organizations(): Organization[] {
    return this._organizations;
  }
  @Input() public set organizations(value: Organization[]) {
    this._organizations = value;
    this._organizationCell.selectOptions.options = this._organizations;
  }

  public get isDeletingUser(): boolean {
    return this._isDeletingUser;
  }
}
