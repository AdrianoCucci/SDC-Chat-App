import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { LoginService } from 'src/app/core/services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private _loginService: LoginService, private _router: Router) { }

  public canActivate(): boolean | UrlTree {
    return this._loginService.isLoggedIn ? true : this._router.parseUrl("");
  }
}
