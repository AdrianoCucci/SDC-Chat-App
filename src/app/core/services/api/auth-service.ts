import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AdminPassResetRequest } from "../../models/auth/admin-pass-reset-request";
import { AuthRequest } from "../../models/auth/auth-request";
import { AuthResponse } from "../../models/auth/auth-response";
import { PassResetRequest } from "../../models/auth/pass-reset-request";
import { WebApiService } from "./web-api.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService extends WebApiService {
  private readonly _apiPrefix: string = "auth";

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public login(request: AuthRequest): Observable<HttpResponse<AuthResponse>> {
    return super.post(`${this._apiPrefix}/login`, request);
  }

  public resetPassword(request: PassResetRequest): Observable<HttpResponse<void>> {
    return this.post(`${this._apiPrefix}/reset-password`, request);
  }

  public adminResetPassword(request: AdminPassResetRequest): Observable<HttpResponse<void>> {
    return this.post(`${this._apiPrefix}/admin-reset-password`, request);
  }
}