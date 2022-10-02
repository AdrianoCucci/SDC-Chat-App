import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socketio2';
import { defer, EMPTY, merge, Observable, Subject, throwError } from 'rxjs';
import { IDisposable } from 'src/app/shared/interfaces/i-disposable';
import { Event } from 'src/app/shared/modules/events/event.model';
import { EventsService } from 'src/app/shared/modules/events/events.service';
import { LoginService } from '../login.service';
import { catchError, takeUntil, takeWhile, tap, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService implements IDisposable {
  private readonly _connected$ = new Subject<ConnectedArgs>();
  private readonly _disconnected$ = new Subject<void>();
  private readonly _connectionError$ = new Subject<void>();
  private readonly _disposed$ = new Subject<void>();

  private _didDisconnect: boolean = false;

  constructor(private _socket: Socket, private _eventsService: EventsService) {
    if (this._socket == null) {
      throw new Error(
        `[${this.constructor.name}] > [Socket] dependency is null`
      );
    }

    this.subscribeEvents();
  }

  public dispose(): void {
    this.disconnect().subscribe(() => {
      this._disposed$.next();
      this._disposed$.complete();
    });
  }

  public on<T = any>(eventName: string): Observable<T> {
    return this._socket.on<T>(eventName);
  }

  public emit<T = any>(eventName: string, payload?: any): Observable<T> {
    const subject = new Subject<T>();

    this._socket.emit(eventName, payload, (response: T) => {
      subject.next(response);
      subject.complete();
    });

    return subject;
  }

  private subscribeEvents(): void {
    merge(
      this.on<void>(this.socketEvents.connect).pipe(
        tap(() => {
          this._eventsService.publish({
            source: this.constructor.name,
            type: this.socketEvents.connect,
            data: { isReconnection: this._didDisconnect },
          });

          this._connected$.next({ isReconnection: this._didDisconnect });
        })
      ),

      this.on<void>(this.socketEvents.disconnect).pipe(
        tap(() => {
          this._didDisconnect = true;
          this._eventsService.publish({
            source: this.constructor.name,
            type: this.socketEvents.disconnect,
          });

          this._disconnected$.next();
        })
      ),

      this.on<any>(this.socketEvents.connectError.replace('-', '_')).pipe(
        tap((error: any) => {
          this._didDisconnect = true;

          this._eventsService.publish({
            source: this.constructor.name,
            type: this.socketEvents.connectError,
            data: error,
            severity: 'error',
          });

          this._connectionError$.next();
        })
      )
    )
      .pipe(takeUntil(this.disposed$))
      .subscribe();

    this._eventsService.subscribe({
      eventSources: LoginService.name,
      eventTypes: 'logout',
      eventHandler: () => this.dispose(),
    });
  }

  public connect(): Observable<void> {
    if (this.isConnected) {
      return EMPTY;
    }

    return defer(() => {
      const observable: Observable<void> = this._socket
        .on<void>(this.socketEvents.connect)
        .pipe(
          takeWhile(() => !this.isConnected),
          timeout(10000),
          catchError((error: any) => {
            const event: Event<Error> = {
              source: this.constructor.name,
              type: this.socketEvents.connectError,
              data: new Error(`Connection attempt timed out after 10 seconds.`),
              severity: 'error',
            };

            this._eventsService.publish(event);
            return throwError(error);
          })
        );

      setTimeout(() => this._socket.connect());
      return observable;
    });
  }

  public disconnect(): Observable<void> {
    if (!this.isConnected) {
      return EMPTY;
    }

    return defer(() => {
      const observable: Observable<void> = this._socket
        .on<void>(this.socketEvents.disconnect)
        .pipe(takeWhile(() => this.isConnected));

      setTimeout(() => this._socket.disconnect());
      return observable;
    });
  }

  public get socketEvents() {
    return {
      connect: 'connect',
      disconnect: 'disconnect',
      connectError: 'connect-error',
    };
  }

  public get connected$(): Observable<ConnectedArgs> {
    return this._connected$.asObservable();
  }

  public get disconnected$(): Observable<void> {
    return this._disconnected$.asObservable();
  }

  public get connectionError$(): Observable<void> {
    return this._connectionError$.asObservable();
  }

  public get disposed$(): Observable<void> {
    return this._disposed$;
  }

  public get isConnected(): boolean {
    return this._socket.connected;
  }
}

export interface ConnectedArgs {
  isReconnection: boolean;
}
