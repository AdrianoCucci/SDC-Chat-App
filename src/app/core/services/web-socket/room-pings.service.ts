import { HttpResponse } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { RoomPing } from '../../models/room-pings/room-ping';
import { Room } from '../../models/rooms/room';
import { RoomsService } from '../api/rooms-service';
import { UsersService } from '../api/users-service';
import { AudioService } from '../audio.service';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class RoomPingsService extends WebSocketService {
  public readonly onPingRequest = new EventEmitter<RoomPing>();
  public readonly onPingResponse = new EventEmitter<RoomPing>();
  public readonly onPingCancel = new EventEmitter<RoomPing>();

  private _requestingPings: RoomPing[];
  private _rooms: Room[];

  constructor(socket: Socket, private _roomsService: RoomsService, private _audioService: AudioService, usersService: UsersService) {
    super(socket, usersService);
  }

  protected initializeEvents(socket: Socket): void {
    super.initializeEvents(socket);

    const events = this.roomPingEvents;

    socket.on(events.roomPingRequest, (roomPing: RoomPing) => {
      this.addRequestingPing(roomPing);
      this.onPingRequest.emit(roomPing);

      if(roomPing.room?.pingSound != null) {
        this._audioService.play(roomPing.room.pingSound);
      }
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

  public loadRooms(organizationId: number): Promise<Room[]> {
    return new Promise<Room[]>(async (resolve, reject) => {
      try {
        const response: HttpResponse<Room[]> = await this._roomsService.getAllRooms({ organizationId }).toPromise();
        this._rooms = response.body;

        resolve(this._rooms);
      }
      catch(error) {
        reject(error);
      }
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

  public get rooms(): Room[] {
    return this._rooms;
  }
}