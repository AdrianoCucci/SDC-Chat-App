import { HttpResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Role } from 'src/app/core/models/auth/role';
import { Organization } from 'src/app/core/models/organizations/organization';
import { User } from 'src/app/core/models/users/user';
import { UserRequest } from 'src/app/core/models/users/user-request';
import { UsersService } from 'src/app/core/services/api/users-service';
import { enumToPairs } from 'src/app/shared/functions/enum-to-pairs';
import { Pair } from 'src/app/shared/models/pair';
import { AppForm } from '../app-form';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserForm extends AppForm<UserRequest, User> {
  @Input() public organizationOptions: Organization[];
  @Input() public defaultOrganizationId?: number;

  public readonly roleOptions: Pair<string, Role>[] = enumToPairs(Role, true);

  constructor(private _usersService: UsersService) {
    super();
  }

  protected async onRequestAdd(model: UserRequest): Promise<User> {
    if(model.organizationId == null && this.defaultOrganizationId != null) {
      model.organizationId = this.defaultOrganizationId;
    }

    const response: HttpResponse<User> = await this._usersService.addUser(model).toPromise();
    return response.body;
  }

  protected async onRequestUpdate(model: UserRequest): Promise<User> {
    if(model.organizationId == null && this.defaultOrganizationId != null) {
      model.organizationId = this.defaultOrganizationId;
    }

    const response: HttpResponse<User> = await this._usersService.updateUser(model.id, model).toPromise();
    return response.body;
  }
}
