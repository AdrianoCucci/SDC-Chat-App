import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Room } from "../../models/rooms/room";
import { RoomParams } from "../../models/rooms/room-params";
import { RoomRequest } from "../../models/rooms/room-request";
import { WebApiService } from "./web-api.service";

@Injectable({
  providedIn: 'root'
})
export class RoomsService extends WebApiService {
  private readonly _apiPrefix: string = "rooms";

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public getAllRooms(params?: RoomParams): Observable<HttpResponse<Room[]>> {
    const query: string = this.buildOptionsQuery(params);
    const url: string = `${this._apiPrefix}${query}`;

    return this.get(url);
  }

  public getRoom(id: number): Observable<HttpResponse<Room>> {
    return this.get(`${this._apiPrefix}/${id}`);
  }

  public addRoom(request: RoomRequest): Observable<HttpResponse<Room>> {
    return this.post(this._apiPrefix, request);
  }

  public updateRoom(id: number, request: RoomRequest): Observable<HttpResponse<Room>> {
    return this.put(`${this._apiPrefix}/${id}`, request);
  }

  public deleteRoom(id: number): Observable<HttpResponse<string>> {
    return this.delete(`${this._apiPrefix}/${id}`, "text");
  }
}