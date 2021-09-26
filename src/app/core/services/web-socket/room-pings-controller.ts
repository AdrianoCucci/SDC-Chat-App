import { HttpResponse } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { RoomPing } from '../../models/room-pings/room-ping';
import { RoomPingState } from '../../models/room-pings/room-ping-state';
import { Room } from '../../models/rooms/room';
import { RoomsService } from '../api/rooms-service';
import { AudioService } from '../audio/audio.service';

export class RoomPingsController {
  public readonly onPingRequest = new EventEmitter<RoomPing>();
  public readonly onPingResponse = new EventEmitter<RoomPing>();
  public readonly onPingCancel = new EventEmitter<RoomPing>();

  private readonly _socket: Socket;
  private readonly _roomsService: RoomsService;
  private readonly _audioService: AudioService;

  private _pings: RoomPing[];
  private _rooms: Room[];

  constructor(socket: Socket, roomsService: RoomsService, audioService: AudioService) {
    this._socket = socket;
    this._roomsService = roomsService;
    this._audioService = audioService;

    this.initializeEvents(this._socket);
  }

  private initializeEvents(socket: Socket): void {
    const events = this.events;

    socket.on(events.roomPingRequest, (roomPing: RoomPing) => {
      this.addPing(roomPing);
      this.onPingRequest.emit(roomPing);

      if(roomPing.room?.pingSound != null) {
        this._audioService.play(roomPing.room.pingSound);
      }
    });

    socket.on(events.roomPingResponse, (roomPing: RoomPing) => {
      this.updatePing(roomPing.guid, roomPing);
      this.onPingResponse.emit(roomPing);
    });

    socket.on(events.roomPingCancel, (roomPing: RoomPing) => {
      this.removePing(roomPing.guid);
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
        this.addPing(response);
        this.onPingRequest.emit(response);
        
        resolve(response);
      });
    });
  }

  public sendPingResponse(roomPing: RoomPing): Promise<RoomPing> {
    return new Promise<RoomPing>((resolve) => {
      this._socket.emit(this.events.roomPingResponse, roomPing, (response: RoomPing) => {
        this.addOrUpdatePing(response);
        this.onPingResponse.emit(response);

        resolve(response);
      });
    });
  }

  public cancelPingRequest(roomPing: RoomPing): void {
    if(roomPing != null) {
      this.onPingCancel.emit(roomPing);
      this._socket.emit(this.events.roomPingCancel, roomPing);
      this.removePing(roomPing.guid);
    }
  }

  public getRequestingPings(): Promise<RoomPing[]> {
    return new Promise<RoomPing[]>((resolve) => {
      this._socket.emit(this.events.getRoomPings, (response: RoomPing[]) => {
        this._pings = response;
        resolve(response);
      });
    });
  }

  public findPing(guid: string): RoomPing {
    return this._pings?.find((r: RoomPing) => r.guid === guid) ?? null;
  }

  public findPingIndex(guid: string): number {
    return this._pings?.findIndex((r: RoomPing) => r.guid === guid) ?? -1;
  }

  public findPings(predicate: (roomPing: RoomPing) => boolean): RoomPing[] {
    return this._pings?.filter(predicate) ?? [];
  }

  public addPing(roomPing: RoomPing): void {
    if(this._pings == null) {
      this._pings = [roomPing];
    }
    else {
      this._pings.push(roomPing);
    }
  }

  public updatePing(guid: string, roomPing: RoomPing): boolean {
    const index: number = this.findPingIndex(guid);
    const canUpdate: boolean = index !== -1;

    if(canUpdate) {
      this._pings[index] = roomPing;
    }

    return canUpdate;
  }

  public addOrUpdatePing(roomPing: RoomPing): void {
    if(!this.updatePing(roomPing.guid, roomPing)) {
      this.addPing(roomPing);
    }
  }

  public removePing(guid: string): boolean {
    const index: number = this.findPingIndex(guid);
    const canRemove: boolean = index !== -1;

    if(canRemove) {
      this._pings.splice(index, 1);
    }

    return canRemove;
  }

  public removeAllRespondedPings(): void {
    if(this.hasPings) {
      this._pings = this._pings.filter((r: RoomPing) => r.state !== RoomPingState.Responded);
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

  public get pings(): RoomPing[] {
    return this._pings;
  }

  public get hasPings(): boolean {
    return this._pings?.length > 0 ?? false;
  }

  public get rooms(): Room[] {
    return this._rooms;
  }

  public get hasRooms(): boolean {
    return this._rooms?.length > 0 ?? false;
  }
}