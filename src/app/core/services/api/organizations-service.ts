import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Organization } from "../../models/organizations/organization";
import { OrganizationRequest } from "../../models/organizations/organization-request";
import { WebApiService } from "./web-api.service";

@Injectable({
  providedIn: 'root'
})
export class OrganizationsService extends WebApiService {
  private readonly _apiPrefix: string = "organizations";

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public getAllOrganizations(): Observable<HttpResponse<Organization[]>> {
    return this.get(this._apiPrefix);
  }

  public getOrganization(id: number): Observable<HttpResponse<Organization>> {
    return this.get(`${this._apiPrefix}/${id}`);
  }

  public addOrganization(request: OrganizationRequest): Observable<HttpResponse<Organization>> {
    return this.post(this._apiPrefix, request);
  }

  public updateOrganization(id: number, request: OrganizationRequest): Observable<HttpResponse<Organization>> {
    return this.put(`${this._apiPrefix}/${id}`, request);
  }

  public deleteOrganization(id: number): Observable<HttpResponse<string>> {
    return this.delete(`${this._apiPrefix}/${id}`, "text");
  }
}