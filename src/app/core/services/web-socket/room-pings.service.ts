import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDisposable } from 'src/app/shared/interfaces/i-disposable';
import { PagedList } from 'src/app/shared/models/pagination/paged-list';
import { EventsService } from 'src/app/shared/modules/events/events.service';
import { RoomPing } from '../../models/room-pings/room-ping';
import { RoomPingState } from '../../models/room-pings/room-ping-state';
import { Room } from '../../models/rooms/room';
import { RoomsService } from '../api/rooms-service';
import { AudioService } from '../audio/audio.service';
import { LoginService } from '../login.service';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class RoomPingsService implements IDisposable {
  private _pings: RoomPing[];
  private _rooms: PagedList<Room>;

  constructor(
    private _socketService: WebSocketService,
    private _roomsService: RoomsService,
    private _audioService: AudioService,
    private _eventsService: EventsService
  ) {
    this.subscribeEvents();
  }

  public dispose(): void {
    this._pings = null;
    this._rooms = null;
  }

  private subscribeEvents(): void {
    const socket: WebSocketService = this._socketService;
    const events = this.socketEvents;
    const eventsService: EventsService = this._eventsService;
    const eventsSource: string = this.constructor.name;
    const audioService: AudioService = this._audioService;

    socket.on<RoomPing>(events.roomPingRequest, (roomPing: RoomPing) => {
      this.addPing(roomPing);

      eventsService.publish({
        source: eventsSource,
        type: events.roomPingRequest,
        data: roomPing
      });

      if(roomPing.room?.pingSound != null) {
        audioService.play(roomPing.room.pingSound);
      }
    });

    socket.on<RoomPing>(events.roomPingResponse, (roomPing: RoomPing) => {
      this.updatePing(roomPing.guid, roomPing);

      eventsService.publish({
        source: eventsSource,
        type: events.roomPingResponse,
        data: roomPing
      });

      if(roomPing.room?.pingSound != null) {
        audioService.stop(roomPing.room.pingSound);
      }
    });

    socket.on<RoomPing>(events.roomPingCancel, (roomPing: RoomPing) => {
      this.removePing(roomPing.guid);

      eventsService.publish({
        source: eventsSource,
        type: events.roomPingCancel,
        data: roomPing
      });

      if(roomPing.room?.pingSound != null) {
        audioService.stop(roomPing.room.pingSound);
      }
    });

    eventsService.subscribe({
      eventSources: LoginService.name,
      eventTypes: "logout",
      eventHandler: () => this.dispose()
    });
  }

  public loadRooms(organizationId: number): Promise<PagedList<Room>> {
    return new Promise<PagedList<Room>>(async (resolve, reject) => {
      try {
        const response: HttpResponse<PagedList<Room>> = await this._roomsService.getAllRooms({ organizationId }).toPromise();
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
      const eventType: string = this.socketEvents.roomPingRequest;

      this._socketService.emit(eventType, roomPing, (response: RoomPing) => {
        this.addPing(response);

        this._eventsService.publish({
          source: this.constructor.name,
          type: eventType,
          data: response
        });

        resolve(response);
      });
    });
  }

  public sendPingResponse(roomPing: RoomPing): Promise<RoomPing> {
    return new Promise<RoomPing>((resolve) => {
      const eventType: string = this.socketEvents.roomPingResponse;

      this._socketService.emit(eventType, roomPing, (response: RoomPing) => {
        this.upsertPing(response);

        this._eventsService.publish({
          source: this.constructor.name,
          type: eventType,
          data: response
        });

        if(response.room?.pingSound != null) {
          this._audioService.stop(response.room.pingSound);
        }

        resolve(response);
      });
    });
  }

  public cancelPingRequest(roomPing: RoomPing): void {
    if(roomPing != null) {
      const eventType: string = this.socketEvents.roomPingCancel;

      this._eventsService.publish({
        source: this.constructor.name,
        type: eventType,
        data: roomPing
      });

      this._socketService.emit(this.socketEvents.roomPingCancel, roomPing);
      this.removePing(roomPing.guid);
    }
  }

  public getRequestingPings(): Promise<RoomPing[]> {
    return new Promise<RoomPing[]>((resolve) => {
      this._socketService.emit(this.socketEvents.getRoomPings, (response: RoomPing[]) => {
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

  public upsertPing(roomPing: RoomPing): void {
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

  public get socketEvents() {
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

  public get rooms(): PagedList<Room> {
    return this._rooms;
  }

  public get hasRooms(): boolean {
    return this._rooms?.data?.length > 0 ?? false;
  }
}