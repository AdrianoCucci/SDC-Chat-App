import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Includable } from 'src/app/shared/models/includable.type';
import { PagedList } from 'src/app/shared/models/pagination/paged-list';
import { Paged } from 'src/app/shared/models/pagination/paged.type';
import { Room } from '../../models/rooms/room';
import { RoomRequest } from '../../models/rooms/room-request';
import { WebApiService } from './web-api.service';

@Injectable({
  providedIn: 'root',
})
export class RoomsService extends WebApiService {
  private readonly _apiPrefix: string = 'rooms';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public getAllRooms(
    model?: Paged<Includable<Partial<Room>>>
  ): Observable<HttpResponse<PagedList<Room>>> {
    const url: string = `${this._apiPrefix}${this.getObjectQueryParams(model)}`;
    return this.get(url);
  }

  public getRoom(id: number): Observable<HttpResponse<Room>> {
    return this.get(`${this._apiPrefix}/${id}`);
  }

  public addRoom(request: RoomRequest): Observable<HttpResponse<Room>> {
    return this.post(this._apiPrefix, request);
  }

  public updateRoom(
    id: number,
    request: RoomRequest
  ): Observable<HttpResponse<Room>> {
    return this.put(`${this._apiPrefix}/${id}`, request);
  }

  public deleteRoom(id: number): Observable<HttpResponse<string>> {
    return this.delete(`${this._apiPrefix}/${id}`, 'text');
  }
}
