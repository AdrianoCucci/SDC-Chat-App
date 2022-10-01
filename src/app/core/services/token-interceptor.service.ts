import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginService } from './login.service';

/**
 * An `HttpInterceptor` service to provide authorization tokens to API requests when the user is logged in.
 */
@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private _loginService: LoginService) {}

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.requestIsToAPI(request)
      ? this.handleApiRequest(request, next)
      : next.handle(request);
  }

  private handleApiRequest(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token: string = this._loginService.getAuthToken();

    if (token) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }

    return next.handle(request);
  }

  private requestIsToAPI(request: HttpRequest<any>): boolean {
    const apiPath: string = `${environment.server.host}${environment.server.apiPath}`;
    return request.url.search(apiPath) !== -1;
  }
}
