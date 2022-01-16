import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Role } from 'src/app/core/models/auth/role';
import { Organization } from 'src/app/core/models/organizations/organization';
import { User } from 'src/app/core/models/users/user';
import { OrganizationsService } from 'src/app/core/services/api/organizations-service';
import { UsersService } from 'src/app/core/services/api/users-service';
import { LoginService } from 'src/app/core/services/login.service';
import { parseHttpError } from 'src/app/shared/functions/parse-http-error';
import { PagedList } from 'src/app/shared/models/pagination/paged-list';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss']
})
export class UsersPage implements OnInit {
  public readonly clientUser: User;

  public loadingVisible: boolean = false;
  public loadError: string;
  public errorVisible: boolean = false;

  private _users: PagedList<User>;
  private _organizations: Organization[];
  private _initialized: boolean = false;

  constructor(private _usersService: UsersService, private _orgsService: OrganizationsService, loginService: LoginService) {
    this.clientUser = loginService.user;
  }

  async ngOnInit(): Promise<void> {
    try {
      this.loadingVisible = true;

      await Promise.all([
        this.loadUsers(this.adminFeatures ? null : this.clientUser.organizationId),
        this.adminFeatures ? this.loadOrganizations() : null
      ]);
    }
    catch(error) {
      this.loadError = parseHttpError(error as HttpErrorResponse, true) as string;
      this.errorVisible = true;
    }
    finally {
      this.loadingVisible = false;
      this._initialized = true;
    }
  }

  private async loadUsers(organizationId?: number): Promise<void> {
    const response: HttpResponse<PagedList<User>> = await this._usersService.getAllUsers({ organizationId }).toPromise();
    this._users = response.body;
  }

  private async loadOrganizations(): Promise<void> {
    const response: HttpResponse<Organization[]> = await this._orgsService.getAllOrganizations().toPromise();
    this._organizations = response.body;
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

  public get organizations(): Organization[] {
    return this._organizations;
  }
}