import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../../models/user";
import { WebApiService } from "./web-api.service";

@Injectable({
  providedIn: 'root'
})
export class UsersService extends WebApiService {
  private readonly _apiPrefix: string = "users";

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public getAllUsers(): Observable<HttpResponse<User[]>> {
    return this.get(this._apiPrefix);
  }
}