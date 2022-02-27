import { EventEmitter, Injectable } from "@angular/core";
import { AuthResponse } from "../models/auth/auth-response";
import { Role } from "../models/auth/role";
import { User } from "../models/users/user";
import { UsersService } from "./api/users-service";
import { EncryptService } from "./encrypt-service";
import { IStorageMedium } from "./storage/storage-medium.interface";
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

  public setCurrentUser(authResponse: AuthResponse, remember?: boolean): User {
    if(authResponse.isSuccess && authResponse.user != null) {
      this.setSavedLogin(authResponse, remember);

      this._currentUser = authResponse.user;
      this.onLogin.emit(this._currentUser);
    }

    return this._currentUser;
  }

  public loadSavedLogin(): boolean {
    const savedLogin: AuthResponse = this.getSavedLogin();

    if(savedLogin != null) {
      this._currentUser = savedLogin.user;
      this.onLogin.emit(this._currentUser);
    }

    return this.isLoggedIn;
  }

  public updateCurrentUser(newUser: User): boolean {
    const canUpdate: boolean = this.isLoggedIn;

    if(canUpdate) {
      const savedLogin: AuthResponse = this.getSavedLogin();
      savedLogin.user = newUser;

      const includeLocalStorage: boolean = this._storageService.local.has(this._storageKey);
      this.setSavedLogin(savedLogin, includeLocalStorage);

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
      this._storageService.forEachMedium((s: IStorageMedium) => s.delete(this._storageKey));
      this._currentUser = null;

      this.onLogout.emit();
    }
  }

  public getAuthToken(): string {
    let token: string = null;

    if(this.isLoggedIn) {
      token = this.getSavedLogin()?.token;
    }

    return token;
  }

  private getSavedLogin(): AuthResponse {
    let savedLogin: AuthResponse = null;

    this._storageService.forEachMedium((s: IStorageMedium) => {
      const authData: string = s.get(this._storageKey);

      if(authData) {
        const decryptedData: string = this._encryptService.decrypt(authData);
        savedLogin = JSON.parse(decryptedData);
        return;
      }
    });

    return savedLogin;
  }

  private setSavedLogin(data: AuthResponse, includeLocalStorage?: boolean): void {
    const savedData: string = this._encryptService.encrypt(JSON.stringify(data));

    this._storageService.session.set(this._storageKey, savedData);

    if(includeLocalStorage) {
      this._storageService.local.set(this._storageKey, savedData);
    }
  }

  public get user(): User {
    return this._currentUser;
  }

  public get isLoggedIn(): boolean {
    if(this._currentUser == null) {
      this._currentUser = this.getSavedLogin()?.user;

      if(this._currentUser != null) {
        this.onLogin.emit(this._currentUser);
      }
    }

    return this._currentUser != null;
  }
}