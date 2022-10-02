import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { defer, Observable, of, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from '../models/users/user';
import { UserRequest } from '../models/users/user-request';
import { UsersService } from './api/users-service';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class UserPrefsService {
  constructor(
    private _usersService: UsersService,
    private _loginService: LoginService
  ) {}

  public getAllPreferences(): Record<string, any> {
    const prefsJson: string = this._loginService.isLoggedIn
      ? this._loginService.user.preferencesJson
      : null;
    const prefsData: Record<string, any> = prefsJson
      ? JSON.parse(prefsJson)
      : null;

    return prefsData;
  }

  public getPreference<T = any>(key: string): T {
    const prefsData: Record<string, any> = this.getAllPreferences();
    return prefsData ? prefsData[key] : null;
  }

  public hasPreference(key: string): boolean {
    return this.getPreference(key) != null;
  }

  public setPreference(
    key: string,
    value: any
  ): Observable<Record<string, any>> {
    return defer((): Observable<Record<string, any>> => {
      let prefsData: Record<string, any> = this.getAllPreferences();

      if (prefsData) {
        prefsData[key] = value;
      } else {
        prefsData = { key: value };
      }

      return this.savePreferences(prefsData);
    });
  }

  public deletePreference(key: string): Observable<Record<string, any>> {
    return defer((): Observable<Record<string, any>> => {
      let prefsData: Record<string, any> = this.getAllPreferences();

      if (!prefsData || prefsData[key] == undefined) {
        return of(prefsData);
      }

      delete prefsData[key];
      return this.savePreferences(prefsData);
    });
  }

  public clearPreferences(): Observable<void> {
    return this.savePreferences(null).pipe(map(() => null));
  }

  public savePreferences(
    preferences: Record<string, any>
  ): Observable<Record<string, any>> {
    if (!this._loginService.isLoggedIn) {
      return throwError('User is not logged in');
    }

    return defer((): Observable<Record<string, any>> => {
      const user: User = this._loginService.user;
      const request: UserRequest = {
        preferencesJson: JSON.stringify(preferences),
      };

      return this._usersService.updateUser(user.id, request).pipe(
        tap((value: HttpResponse<User>) =>
          this._loginService.updateCurrentUser({
            ...user,
            preferencesJson: value.body.preferencesJson,
          })
        ),
        map((value: HttpResponse<User>) =>
          JSON.parse(value.body.preferencesJson)
        )
      );
    });
  }
}
