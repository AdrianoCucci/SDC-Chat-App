import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../../models/users/user";
import { UserParams } from "../../models/users/user-params";
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
}