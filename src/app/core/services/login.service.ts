import { EventEmitter, Injectable } from "@angular/core";
import { AuthResponse } from "../models/auth/auth-response";
import { Role } from "../models/auth/role";
import { User } from "../models/users/user";
import { UsersService } from "./api/users-service";
import { EncryptService } from "./encrypt-service";
import { StorageService } from "./storage/storage-service";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public readonly onLogin = new EventEmitter<User>();
  public readonly onLogout = new EventEmitter<void>();
  public readonly onUserUpdate = new EventEmitter<User>();

  private readonly _storageKey: string = "auth";

  private _currentUser: User;

  constructor(private _storageService: StorageService, private _encryptService: EncryptService, private _usersService: UsersService) { }

  public setCurrentUser(authResponse: AuthResponse): User {
    if(authResponse.isSuccess && authResponse.user != null) {
      const savedData: string = this._encryptService.encrypt(JSON.stringify(authResponse));
      this._storageService.session.set(this._storageKey, savedData);

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

      const savedData: string = this._encryptService.encrypt(JSON.stringify(sessionLogin));
      this._storageService.session.set(this._storageKey, savedData);

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
      this._usersService.updateUser(this._currentUser.id, { isOnline: false }).toPromise();
      this._storageService.session.clear();
      this._currentUser = null;

      this.onLogout.emit();
    }
  }

  public getAuthToken(): string {
    let token: string = null;

    if(this.isLoggedIn) {
      token = this.getSessionLogin()?.token;
    }

    return token;
  }

  private getSessionLogin(): AuthResponse {
    let sessionLogin: AuthResponse = null;
    const authData: string = this._storageService.session.get(this._storageKey);

    if(authData) {
      const decryptedData: string = this._encryptService.decrypt(authData);
      sessionLogin = JSON.parse(decryptedData);
    }

    return sessionLogin;
  }

  public get user(): User {
    return this._currentUser;
  }

  public get isLoggedIn(): boolean {
    if(this._currentUser == null) {
      this._currentUser = this.getSessionLogin()?.user;

      if(this._currentUser != null) {
        this.onLogin.emit(this._currentUser);
      }
    }

    return this._currentUser != null;
  }
}