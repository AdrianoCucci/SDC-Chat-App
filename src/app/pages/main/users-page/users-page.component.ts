import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { defer, forkJoin, merge, Observable, throwError } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { Role } from 'src/app/core/models/auth/role';
import { Organization } from 'src/app/core/models/organizations/organization';
import { User } from 'src/app/core/models/users/user';
import { OrganizationsService } from 'src/app/core/services/api/organizations-service';
import { UsersService } from 'src/app/core/services/api/users-service';
import { LoginService } from 'src/app/core/services/login.service';
import { parseErrorMessage } from 'src/app/shared/functions/parse-http-error';
import { PagedList } from 'src/app/shared/models/pagination/paged-list';
import { Paginatable } from 'src/app/shared/models/pagination/paginatable';
import { PageEvent } from 'src/app/shared/modules/table/page-event';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss'],
})
export class UsersPage implements OnInit {
  public readonly clientUser: User;

  public readonly pageHandler = (
    event: PageEvent
  ): Observable<PagedList<User>> => {
    return this.loadUsers({
      take: event.limit,
      skip: event.offset * event.limit,
    });
  };

  public loadingVisible: boolean = false;
  public loadError: string;
  public errorVisible: boolean = false;

  private _users: PagedList<User>;
  private _organizations: PagedList<Organization>;
  private _initialized: boolean = false;

  constructor(
    private _usersService: UsersService,
    private _orgsService: OrganizationsService,
    loginService: LoginService
  ) {
    this.clientUser = loginService.user;
  }

  ngOnInit(): void {
    this.loadAllData()
      .pipe(tap(() => (this._initialized = true)))
      .subscribe();
  }

  private loadAllData(): Observable<void> {
    return defer((): Observable<void> => {
      this.loadingVisible = true;
      this.errorVisible = false;

      const observables: Observable<any>[] = [this.loadUsers()];

      if (this.adminFeatures) {
        observables.push(this.loadOrganizations());
      }

      return forkJoin(observables).pipe(
        finalize(() => (this.loadingVisible = false)),
        catchError((error: any) => {
          this.loadError = parseErrorMessage(error);
          this.errorVisible = true;

          return throwError(error);
        }),
        map(() => null)
      );
    });
  }

  private loadUsers(pagination?: Paginatable): Observable<PagedList<User>> {
    return this._usersService
      .getAllUsers({
        organizationId: this.adminFeatures
          ? null
          : this.clientUser.organizationId,
        skip: pagination?.skip,
        take: pagination?.take,
      })
      .pipe(
        map((value: HttpResponse<PagedList<User>>) => value.body),
        tap((value: PagedList<User>) => (this._users = value))
      );
  }

  private loadOrganizations(): Observable<PagedList<Organization>> {
    return this._orgsService.getAllOrganizations().pipe(
      map((value: HttpResponse<PagedList<Organization>>) => value.body),
      tap((value: PagedList<Organization>) => (this._organizations = value))
    );
  }

  public get initialized(): boolean {
    return this._initialized;
  }

  public get adminFeatures(): boolean {
    return this.clientUser?.role === Role.Administrator ?? false;
  }

  public get users(): PagedList<User> {
    return this._users;
  }

  public get organizations(): PagedList<Organization> {
    return this._organizations;
  }
}
