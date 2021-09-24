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

  constructor(socket: Socket) {
    super(socket);
  }

  protected initializeEvents(socket: Socket): void {
    super.initializeEvents(socket);

    const events = this.roomPingEvents;

    socket.on(events.roomPingRequest, (roomPing: RoomPing) => this.onPingRequest.emit(roomPing));
    socket.on(events.roomPingResponse, (roomPing: RoomPing) => this.onPingResponse.emit(roomPing));
    socket.on(events.roomPingCancel, (roomPing: RoomPing) => this.onPingCancel.emit(roomPing));
  }

  public sendPingRequest(roomPing: RoomPing): void {
    if(roomPing != null) {
      this._socket.emit(this.roomPingEvents.roomPingRequest, roomPing);
    }
  }

  public sendPingResponse(roomPing: RoomPing): void {
    if(roomPing != null) {
      this._socket.emit(this.roomPingEvents.roomPingResponse, roomPing);
    }
  }

  public cancelPingRequest(roomPing: RoomPing): void {
    if(roomPing != null) {
      this._socket.emit(this.roomPingEvents.roomPingCancel, roomPing);
    }
  }

  public getRequestingPings(): Promise<RoomPing[]> {
    return new Promise<RoomPing[]>((resolve) => {
      this._socket.emit(this.roomPingEvents.getRoomPings, (response: RoomPing[]) => resolve(response));
    });
  }

  public get roomPingEvents() {
    return {
      roomPingRequest: "room-ping-request",
      roomPingResponse: "room-ping-response",
      roomPingCancel: "room-ping-cancel",
      getRoomPings: "get-room-pings"
    };
  }
}