import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { RoomPing } from '../../models/room-pings/room-ping';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class RoomPingsService extends WebSocketService {
  public readonly onPingRequest = new EventEmitter<RoomPing>();
  public readonly onPingResponse = new EventEmitter<RoomPing>();
  public readonly onPingCancel = new EventEmitter<RoomPing>();

  private _requestingPings: RoomPing[];

  constructor(socket: Socket) {
    super(socket);
  }

  protected initializeEvents(socket: Socket): void {
    super.initializeEvents(socket);

    const events = this.roomPingEvents;

    socket.on(events.roomPingRequest, (roomPing: RoomPing) => {
      this.addRequestingPing(roomPing);
      this.onPingRequest.emit(roomPing);
    });

    socket.on(events.roomPingResponse, (roomPing: RoomPing) => {
      this.removeRequestingPing(roomPing);
      this.onPingResponse.emit(roomPing);
    });

    socket.on(events.roomPingCancel, (roomPing: RoomPing) => {
      this.removeRequestingPing(roomPing);
      this.onPingCancel.emit(roomPing);
    });
  }

  public sendPingRequest(roomPing: RoomPing): Promise<RoomPing> {
    return new Promise<RoomPing>((resolve) => {
      this._socket.emit(this.roomPingEvents.roomPingRequest, roomPing, (response: RoomPing) => {
        this.addRequestingPing(response);
        resolve(response);
      });
    });
  }

  public sendPingResponse(roomPing: RoomPing): Promise<RoomPing> {
    return new Promise<RoomPing>((resolve) => {
      this._socket.emit(this.roomPingEvents.roomPingResponse, roomPing, (response: RoomPing) => {
        this.removeRequestingPing(response);
        resolve(response);
      });
    });
  }

  public cancelPingRequest(roomPing: RoomPing): void {
    if(roomPing != null) {
      this._socket.emit(this.roomPingEvents.roomPingCancel, roomPing);
      this.removeRequestingPing(roomPing);
    }
  }

  public getRequestingPings(): Promise<RoomPing[]> {
    return new Promise<RoomPing[]>((resolve) => {
      this._socket.emit(this.roomPingEvents.getRoomPings, (response: RoomPing[]) => {
        this._requestingPings = response;
        resolve(response);
      });
    });
  }

  private addRequestingPing(roomPing: RoomPing): void {
    if(this._requestingPings == null) {
      this._requestingPings = [roomPing];
    }
    else {
      this._requestingPings.push(roomPing);
    }
  }

  private removeRequestingPing(roomPing: RoomPing): void {
    const index: number = this._requestingPings?.findIndex((r: RoomPing) => r.guid === roomPing.guid);

    if(index !== -1) {
      this._requestingPings.splice(index, 1);
    }
  }

  public get roomPingEvents() {
    return {
      roomPingRequest: "room-ping-request",
      roomPingResponse: "room-ping-response",
      roomPingCancel: "room-ping-cancel",
      getRoomPings: "get-room-pings"
    };
  }

  public get requestingPings(): RoomPing[] {
    return this._requestingPings;
  }
}