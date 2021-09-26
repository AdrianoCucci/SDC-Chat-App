import { EventEmitter, Injectable } from "@angular/core";
import { AuthResponse } from "../models/auth/auth-response";
import { Role } from "../models/auth/role";
import { User } from "../models/users/user";
import { StorageService } from "./storage-service";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public readonly onLogin = new EventEmitter<User>();
  public readonly onLogout = new EventEmitter<void>();
  public readonly onUserUpdate = new EventEmitter<User>();

  private readonly _storageKey: string = "auth";

  private _currentUser: User;

  constructor(private _storageService: StorageService) { }

  public setCurrentUser(authResponse: AuthResponse): User {
    if(authResponse.isSuccess && authResponse.user != null) {
      this._storageService.setSessionEncrypted(this._storageKey, authResponse);
      this._currentUser = authResponse.user;

      this.onLogin.emit(this._currentUser);
    }

    return this._currentUser;
  }

  public updateCurrentUser(newUser: User): boolean {
    const canUpdate: boolean = this.isLoggedIn;

    if(canUpdate) {
      const sessionLogin: AuthResponse = this.getSessionLogin();
      sessionLogin.user = newUser;

      this._storageService.setSessionEncrypted(this._storageKey, sessionLogin);
      this._currentUser = newUser;

      this.onUserUpdate.emit(this._currentUser);
    }

    return canUpdate;
  }

  public userHasRole(...roles: Role[]): boolean {
    let hasRole: boolean = false;

    if(this.isLoggedIn && roles != null) {
      hasRole = roles.includes(this._currentUser.role);
    }

    return hasRole;
  }

  public logout(): void {
    if(this.isLoggedIn) {
      this._storageService.clearSession();
      this._currentUser = null;

      this.onLogout.emit();
    }
  }

  public getAuthToken(): string {
    let token: string = null;

    if(this.isLoggedIn) {
      const authResponse: AuthResponse = this._storageService.getSessionDecrypted(this._storageKey);
      token = authResponse.token;
    }

    return token;
  }

  private getSessionLogin(): AuthResponse {
    return this._storageService.getSessionDecrypted(this._storageKey);
  }

  public get user(): User {
    return this._currentUser;
  }

  public get isLoggedIn(): boolean {
    if(this._currentUser == null) {
      this._currentUser = this.getSessionLogin()?.user;
    }

    return this._currentUser != null;
  }
}