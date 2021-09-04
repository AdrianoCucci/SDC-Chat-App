import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export abstract class WebApiService {
  protected readonly _apiRoot: string = `${environment.server.url}/${environment.server.apiPrefix}`;
  protected readonly _httpOptions: any = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    }),
    observe: "response"
  };

  constructor(private _httpClient: HttpClient) { }

  protected get<T = any>(url: string, responseType?: string): Observable<HttpResponse<T>> {
    return this._httpClient.get<T>(this.getFullUrl(url), this.getHttpOptions(responseType)) as Observable<HttpResponse<T>>;
  }

  protected post<T = any>(url: string, body: any, responseType?: string): Observable<HttpResponse<T>> {
    return this._httpClient.post<T>(this.getFullUrl(url), body, this.getHttpOptions(responseType)) as Observable<HttpResponse<T>>;
  }

  protected put<T = any>(url: string, body: any, responseType?: string): Observable<HttpResponse<T>> {
    return this._httpClient.put<T>(this.getFullUrl(url), body, this.getHttpOptions(responseType)) as Observable<HttpResponse<T>>;
  }

  protected delete<T = any>(url: string, responseType?: string): Observable<HttpResponse<T>> {
    return this._httpClient.delete<T>(this.getFullUrl(url), this.getHttpOptions(responseType)) as Observable<HttpResponse<T>>;
  }
  
  private getHttpOptions(responseType?: string): any {
    let httpOptions: any = this._httpOptions;

    if(responseType) {
      httpOptions = Object.assign({}, this._httpOptions);
      httpOptions.responseType = responseType
    };

    return httpOptions;
  }

  protected getFullUrl(endpoint?: string): string {
    return this._apiRoot + (endpoint ? endpoint : "");
  }

  protected appendQueryParam(query: string, paramName: string, paramValue: any): string {
    return query + `${(query.startsWith('?') ? '&' : '?')}${paramName}=${paramValue}`;
  }
}
