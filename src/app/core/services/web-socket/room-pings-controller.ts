import { HttpResponse } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { RoomPing } from '../../models/room-pings/room-ping';
import { Room } from '../../models/rooms/room';
import { RoomsService } from '../api/rooms-service';
import { AudioService } from '../audio.service';

export class RoomPingsController {
  public readonly onPingRequest = new EventEmitter<RoomPing>();
  public readonly onPingResponse = new EventEmitter<RoomPing>();
  public readonly onPingCancel = new EventEmitter<RoomPing>();

  private readonly _socket: Socket;
  private readonly _roomsService: RoomsService;
  private readonly _audioService: AudioService;

  private _requestingPings: RoomPing[];
  private _rooms: Room[];
  private _clientResponsePings: RoomPing[];

  constructor(socket: Socket, roomsService: RoomsService, audioService: AudioService) {
    this._socket = socket;
    this._roomsService = roomsService;
    this._audioService = audioService;

    this.initializeEvents(this._socket);
  }

  private initializeEvents(socket: Socket): void {
    const events = this.events;

    socket.on(events.roomPingRequest, (roomPing: RoomPing) => {
      this.addRequestingPing(roomPing);
      this.onPingRequest.emit(roomPing);

      if(roomPing.room?.pingSound != null) {
        this._audioService.play(roomPing.room.pingSound);
      }
    });

    socket.on(events.roomPingResponse, (roomPing: RoomPing) => {
      this.removeRequestingPing(roomPing);
      this.addClientResponsePing(roomPing);

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
      this._socket.emit(this.events.roomPingRequest, roomPing, (response: RoomPing) => {
        this.addRequestingPing(response);
        resolve(response);
      });
    });
  }

  public sendPingResponse(roomPing: RoomPing): Promise<RoomPing> {
    return new Promise<RoomPing>((resolve) => {
      this._socket.emit(this.events.roomPingResponse, roomPing, (response: RoomPing) => {
        this.removeRequestingPing(response);
        this.addClientResponsePing(response);

        resolve(response);
      });
    });
  }

  public cancelPingRequest(roomPing: RoomPing): void {
    if(roomPing != null) {
      this._socket.emit(this.events.roomPingCancel, roomPing);
      this.removeRequestingPing(roomPing);
    }
  }

  public getRequestingPings(): Promise<RoomPing[]> {
    return new Promise<RoomPing[]>((resolve) => {
      this._socket.emit(this.events.getRoomPings, (response: RoomPing[]) => {
        this._requestingPings = response;
        resolve(response);
      });
    });
  }

  public addRequestingPing(roomPing: RoomPing): void {
    if(this._requestingPings == null) {
      this._requestingPings = [roomPing];
    }
    else {
      this._requestingPings.push(roomPing);
    }
  }

  public removeRequestingPing(roomPing: RoomPing): void {
    const index: number = this._requestingPings?.findIndex((r: RoomPing) => r.guid === roomPing.guid);

    if(index !== -1) {
      this._requestingPings.splice(index, 1);
    }
  }

  public addClientResponsePing(roomPing: RoomPing): void {
    if(this._clientResponsePings == null) {
      this._clientResponsePings = [roomPing];
    }
    else {
      this._clientResponsePings.push(roomPing);
    }
  }

  public removeClientResponsePing(roomPing: RoomPing): void {
    const index: number = this._clientResponsePings?.findIndex((r: RoomPing) => r.guid === roomPing.guid);

    if(index !== -1) {
      this._clientResponsePings.splice(index, 1);
    }
  }

  public get events() {
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

  public get hasRequestingPings(): boolean {
    return this._requestingPings?.length > 0 ?? false;
  }

  public get rooms(): Room[] {
    return this._rooms;
  }

  public get hasRooms(): boolean {
    return this._rooms?.length > 0 ?? false;
  }

  public get clientResponsePings(): RoomPing[] {
    return this._clientResponsePings;
  }

  public get hasClientResponsePings(): boolean {
    return this._clientResponsePings?.length > 0 ?? false;
  }
}