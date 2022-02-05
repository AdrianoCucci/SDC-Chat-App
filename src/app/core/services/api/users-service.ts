import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Includable } from "src/app/shared/models/includable.type";
import { PagedList } from "src/app/shared/models/pagination/paged-list";
import { Paged } from "src/app/shared/models/pagination/paged.type";
import { User } from "../../models/users/user";
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

  public getAllUsers(model?: Paged<Includable<Partial<User>>>): Observable<HttpResponse<PagedList<User>>> {
    const url: string = `${this._apiPrefix}${this.getObjectQueryParams(model)}`;
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
}