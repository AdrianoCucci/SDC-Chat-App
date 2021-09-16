import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Role } from 'src/app/core/models/auth/role';
import { User } from 'src/app/core/models/users/user';
import { UsersService } from 'src/app/core/services/api/users-service';
import { LoginService } from 'src/app/core/services/login.service';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss']
})
export class UsersPage implements OnInit {
  public loadingVisible: boolean = false;
  public loadingText: string;

  private readonly _clientUser: User;
  private _users: User[];

  constructor(private _usersService: UsersService, loginService: LoginService) {
    this._clientUser = loginService.user;
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  private async loadUsers(): Promise<void> {
    try {
      this.loadingText = "Loading users...";
      this.loadingVisible = true;

      const organizationId: number = this.adminFeatures ? null : this._clientUser.organizationId;
      const response: HttpResponse<User[]> = await this._usersService.getAllUsers({ organizationId }).toPromise();

      this._users = response.body;
    }
    catch(error) {
      console.error(error);
    }
    finally {
      this.loadingVisible = false;
    }
  }

  public get adminFeatures(): boolean {
    return this._clientUser?.role === Role.Administrator ?? false;
  }

  public get users(): User[] {
    return this._users;
  }

  public get hasUsers(): boolean {
    return this._users?.length > 0 ?? false;
  }
}