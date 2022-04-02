import { HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../models/users/user";
import { UserRequest } from "../models/users/user-request";
import { UsersService } from "./api/users-service";
import { LoginService } from "./login.service";

@Injectable({ providedIn: 'root' })
export class UserPrefsService {
  constructor(private _usersService: UsersService, private _loginService: LoginService) { }

  public getAllPreferences(): object {
    const prefsJson: string = this._loginService.isLoggedIn ? this._loginService.user.preferencesJson : null;
    const prefsData: object = prefsJson ? JSON.parse(prefsJson) : null;

    return prefsData;
  }

  public getPreference<T = any>(key: string): T {
    const prefsData: object = this.getAllPreferences();
    return prefsData ? prefsData[key] : null;
  }

  public async setPreference(key: string, value: any): Promise<object> {
    let prefsData: object = this.getAllPreferences();

    prefsData
      ? prefsData[key] = value
      : prefsData = { key: value };

    return await this.savePreferences(prefsData);
  }

  public hasPreference(key: string): boolean {
    return this.getPreference(key) != null;
  }

  public async savePreferences(preferences: object): Promise<object> {
    let result: Promise<object>;

    try {
      if(preferences == null) {
        throw new Error("[preferences] cannot be null");
      }
      if(!this._loginService.isLoggedIn) {
        throw new Error("User is not logged in");
      }

      const user: User = this._loginService.user;

      const request: UserRequest = {
        preferencesJson: JSON.stringify(preferences)
      };

      const response: HttpResponse<User> = await this._usersService.updateUser(user.id, request).toPromise();
      this._loginService.updateCurrentUser({ ...user, preferencesJson: response.body.preferencesJson });

      result = Promise.resolve(JSON.parse(response.body.preferencesJson));
    }
    catch(error) {
      result = Promise.reject(error);
    }

    return result;
  }
}