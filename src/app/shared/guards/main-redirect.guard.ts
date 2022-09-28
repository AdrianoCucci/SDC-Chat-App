import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { LoginService } from 'src/app/core/services/login.service';
import { MAIN_PATHS } from '../app-paths';

@Injectable({
  providedIn: 'root',
})
export class MainRedirectGuard implements CanActivate {
  constructor(private _loginService: LoginService, private _router: Router) {}

  public canActivate(): boolean | UrlTree {
    return this._loginService.isLoggedIn
      ? this._router.parseUrl(MAIN_PATHS.root)
      : true;
  }
}
