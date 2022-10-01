import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { emptyPagedList } from 'src/app/shared/functions/empty-paged-list';
import { PagedList } from 'src/app/shared/models/pagination/paged-list';
import { EventsService } from 'src/app/shared/modules/events/events.service';
import { RoomPing } from '../../models/room-pings/room-ping';
import { RoomPingState } from '../../models/room-pings/room-ping-state';
import { Room } from '../../models/rooms/room';
import { RoomsService } from '../api/rooms-service';
import { AudioService } from '../audio/audio.service';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root',
})
export class RoomPingsService {
  public readonly disposed$: Observable<void> =
    this._socketService.disposed$.pipe(
      tap(() => {
        this._roomPingRequest$.complete();
        this._roomPingResponse$.complete();
        this._roomPingCancel$.complete();
        this._pings$.complete();
        this._rooms$.complete();
      })
    );

  private readonly _roomPingRequest$ = new Subject<RoomPing>();
  private readonly _roomPingResponse$ = new Subject<RoomPing>();
  private readonly _roomPingCancel$ = new Subject<RoomPing>();
  private readonly _pings$ = new BehaviorSubject<RoomPing[]>([]);
  private readonly _rooms$ = new BehaviorSubject<PagedList<Room>>(
    emptyPagedList<Room>()
  );

  constructor(
    private _socketService: WebSocketService,
    private _roomsService: RoomsService,
    private _audioService: AudioService,
    private _eventsService: EventsService
  ) {
    this.subscribeEvents();
  }

  private subscribeEvents(): void {
    merge(
      this._socketService.on(this.socketEvents.roomPingRequest).pipe(
        tap((value: RoomPing) => {
          this.addPing(value);

          this._eventsService.publish({
            source: this.constructor.name,
            type: this.socketEvents.roomPingRequest,
            data: value,
          });

          if (value.room?.pingSound != null) {
            this._audioService.play(value.room.pingSound);
          }

          this._roomPingRequest$.next();
        })
      ),

      this._socketService.on(this.socketEvents.roomPingResponse).pipe(
        tap((value: RoomPing) => {
          this.updatePing(value.guid, value);

          this._eventsService.publish({
            source: this.constructor.name,
            type: this.socketEvents.roomPingCancel,
            data: value,
          });

          if (value.room?.pingSound != null) {
            this._audioService.stop(value.room.pingSound);
          }

          this._roomPingResponse$.next();
        })
      ),

      this._socketService.on(this.socketEvents.roomPingCancel).pipe(
        tap((value: RoomPing) => {
          this.removePing(value.guid);

          this._eventsService.publish({
            source: this.constructor.name,
            type: this.socketEvents.roomPingCancel,
            data: value,
          });

          if (value.room?.pingSound != null) {
            this._audioService.stop(value.room.pingSound);
          }

          this._roomPingCancel$.next(value);
        })
      )
    )
      .pipe(takeUntil(this.disposed$))
      .subscribe();
  }

  public loadRooms(organizationId: number): Observable<PagedList<Room>> {
    return this._roomsService.getAllRooms({ organizationId }).pipe(
      map((response: HttpResponse<PagedList<Room>>) => response.body),
      tap((rooms: PagedList<Room>) => this._rooms$.next(rooms))
    );
  }

  public sendPingRequest(roomPing: RoomPing): Observable<RoomPing> {
    return this._socketService
      .emit<RoomPing>(this.socketEvents.roomPingRequest, roomPing)
      .pipe(tap((response: RoomPing) => this.addPing(response)));
  }

  public sendPingResponse(roomPing: RoomPing): Observable<RoomPing> {
    return this._socketService
      .emit<RoomPing>(this.socketEvents.roomPingResponse, roomPing)
      .pipe(
        tap((response: RoomPing) => {
          this.upsertPing(response);

          if (response.room?.pingSound != null) {
            this._audioService.stop(response.room.pingSound);
          }
        })
      );
  }

  public cancelPingRequest(roomPing: RoomPing): Observable<void> {
    return this._socketService
      .emit<void>(this.socketEvents.roomPingCancel, roomPing)
      .pipe(tap(() => this.removePing(roomPing.guid)));
  }

  public getRequestingPings(): Observable<RoomPing[]> {
    return this._socketService
      .emit<RoomPing[]>(this.socketEvents.getRoomPings)
      .pipe(tap((response: RoomPing[]) => this._pings$.next(response)));
  }

  public findPing(guid: string): RoomPing | undefined {
    return this._pings$.value.find((r: RoomPing) => r.guid === guid);
  }

  public findPingIndex(guid: string): number {
    return this._pings$.value.findIndex((r: RoomPing) => r.guid === guid);
  }

  public findPings(predicate: (roomPing: RoomPing) => boolean): RoomPing[] {
    return this._pings$.value.filter(predicate);
  }

  public addPing(roomPing: RoomPing): void {
    if (!this.findPing(roomPing.guid)) {
      this._pings$.next([...this._pings$.value, roomPing]);
    }
  }

  public updatePing(guid: string, roomPing: RoomPing): boolean {
    const index: number = this.findPingIndex(guid);
    const canUpdate: boolean = index !== -1;

    if (canUpdate) {
      this._pings$.value[index] = roomPing;
      this._pings$.next(this._pings$.value);
    }

    return canUpdate;
  }

  public upsertPing(roomPing: RoomPing): void {
    if (!this.updatePing(roomPing.guid, roomPing)) {
      this.addPing(roomPing);
    }
  }

  public removePing(guid: string): boolean {
    const index: number = this.findPingIndex(guid);
    const canRemove: boolean = index !== -1;

    if (canRemove) {
      this._pings$.value.splice(index, 1);
      this._pings$.next(this._pings$.value);
    }

    return canRemove;
  }

  public removeAllRespondedPings(): void {
    if (this.hasPings) {
      const pings: RoomPing[] = this._pings$.value.filter(
        (r: RoomPing) => r.state !== RoomPingState.Responded
      );

      this._pings$.next(pings);
    }
  }

  public get socketEvents() {
    return {
      roomPingRequest: 'room-ping-request',
      roomPingResponse: 'room-ping-response',
      roomPingCancel: 'room-ping-cancel',
      getRoomPings: 'get-room-pings',
    };
  }

  public get roomPingRequest$(): Observable<RoomPing> {
    return this._roomPingRequest$.asObservable();
  }

  public get roomPingResponse$(): Observable<RoomPing> {
    return this._roomPingResponse$.asObservable();
  }

  public get roomPingCancel$(): Observable<RoomPing> {
    return this._roomPingCancel$.asObservable();
  }

  public get pings$(): Observable<RoomPing[]> {
    return this._pings$.asObservable();
  }

  public get rooms$(): Observable<PagedList<Room>> {
    return this._rooms$.asObservable();
  }

  public get hasPings(): boolean {
    return this._pings$.value.length > 0;
  }

  public get hasRooms(): boolean {
    return this._rooms$.value.data.length > 0;
  }
}
