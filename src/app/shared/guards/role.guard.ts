import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { Role } from 'src/app/core/models/auth/role';
import { LoginService } from 'src/app/core/services/login.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private _loginService: LoginService, private _router: Router) { }

  public canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    let result: boolean | UrlTree = true;

    const requiredRoles: Role[] = route.data.roles;

    if(!this._loginService.userHasRole(...requiredRoles)) {
      this._loginService.logout();
      result = this._router.parseUrl("");
    }

    return result;
  }
}