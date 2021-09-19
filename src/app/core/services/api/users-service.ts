import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AdminPassResetRequest } from "../../models/auth/admin-pass-reset-request";
import { PassResetRequest } from "../../models/auth/pass-reset-request";
import { User } from "../../models/users/user";
import { UserParams } from "../../models/users/user-params";
import { UserRequest } from "../../models/users/user-request";
import { WebApiService } from "./web-api.service";

@Injectable({
  providedIn: 'root'
})
export class UsersService extends WebApiService {
  private readonly _apiPrefix: string = "users";

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public getAllUsers(params?: UserParams): Observable<HttpResponse<User[]>> {
    const query: string = this.buildOptionsQuery(params);
    const url: string = `${this._apiPrefix}${query}`;

    return this.get(url);
  }

  public getUser(id: number): Observable<HttpResponse<User>> {
    return this.get(`${this._apiPrefix}/${id}`);
  }

  public addUser(request: UserRequest): Observable<HttpResponse<User>> {
    return this.post(this._apiPrefix, request);
  }

  public updateUser(id: number, request: UserRequest): Observable<HttpResponse<User>> {
    return this.put(`${this._apiPrefix}/${id}`, request);
  }

  public deleteUser(id: number): Observable<HttpResponse<void>> {
    return this.delete(`${this._apiPrefix}/${id}`);
  }

  public resetPassword(id: number, request: PassResetRequest): Observable<HttpResponse<void>> {
    return this.put(`${this._apiPrefix}/${id}/reset-password`, request);
  }

  public adminResetPassword(id: number, request: AdminPassResetRequest): Observable<HttpResponse<void>> {
    return this.put(`${this._apiPrefix}/${id}/admin-reset-password`, request);
  }
}