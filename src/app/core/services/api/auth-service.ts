import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthRequest } from "../../models/auth/auth-request";
import { AuthResponse } from "../../models/auth/auth-response";
import { WebApiService } from "./web-api.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService extends WebApiService {
  private readonly _apiPrefix: string = "authentication";

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public login(request: AuthRequest): Observable<HttpResponse<AuthResponse>> {
    return super.post(`${this._apiPrefix}/login`, request);
  }
}