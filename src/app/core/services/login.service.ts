import { EventEmitter, Injectable } from "@angular/core";
import { AuthResponse } from "../models/auth/auth-response";
import { User } from "../models/users/user";
import { StorageService } from "./storage-service";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public readonly onLogin = new EventEmitter<User>();
  public readonly onLogout = new EventEmitter<void>();

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