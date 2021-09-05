import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginService } from './login.service';

/**
 * An `HttpInterceptor` service to provide authorization tokens to API requests when the user is logged in.
 */
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private _loginService: LoginService) { }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.requestIsToAPI(request)
      ? from(this.handleApiRequest(request, next))
      : next.handle(request);
  }

  private async handleApiRequest(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    const token: string = this._loginService.getAuthToken();

    if(token != null != null) {
      request = request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }

    return next.handle(request).toPromise();
  }

  private requestIsToAPI(request: HttpRequest<any>): boolean {
    const apiUrl: string = `${environment.server.url}/${environment.server.apiPrefix}`;
    return request.url.search(apiUrl) !== -1;
  }
}
