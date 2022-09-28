import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socketio2';
import { Subscription } from 'rxjs';
import { IDisposable } from 'src/app/shared/interfaces/i-disposable';
import { Event } from 'src/app/shared/modules/events/event.model';
import { EventsService } from 'src/app/shared/modules/events/events.service';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService implements IDisposable {
  private _subscription: Subscription;
  private _didDisconnect: boolean = false;

  constructor(private _socket: Socket, private _eventsService: EventsService) {
    if (this._socket == null) {
      throw new Error(
        `[${this.constructor.name}] > [Socket] dependency is null`
      );
    }

    this.subsribeEvents();
  }

  public dispose(): void {
    this.disconnect();

    this._subscription?.unsubscribe();
    this._subscription = undefined;
  }

  public on<T = any>(eventName: string, callback: (event: T) => void): void {
    if (this._subscription == null) {
      this._subscription = new Subscription();
    }

    this._subscription.add(
      this._socket.on<T>(eventName).subscribe((e: T) => callback(e))
    );
  }

  public emit<T = any>(
    eventName: string,
    payload: any,
    response?: (data: T) => void
  ) {
    response == null
      ? this._socket.emit(eventName, payload)
      : this._socket.emit(eventName, payload, (d: T) => response(d));
  }

  private subsribeEvents(): void {
    const events = this.socketEvents;
    const eventsService: EventsService = this._eventsService;
    const eventsSource: string = this.constructor.name;

    this.on(events.connect, () => {
      eventsService.publish({
        source: eventsSource,
        type: events.connect,
        data: { isReconnection: this._didDisconnect },
      });
    });

    this.on(events.disconnect, () => {
      this._didDisconnect = true;
      eventsService.publish({ source: eventsSource, type: events.disconnect });
    });

    this.on(events.connectError.replace('-', '_'), (error: any) => {
      this._didDisconnect = true;

      eventsService.publish({
        source: eventsSource,
        type: events.connectError,
        data: error,
        severity: 'error',
      });
    });

    eventsService.subscribe({
      eventSources: LoginService.name,
      eventTypes: 'logout',
      eventHandler: () => this.dispose(),
    });
  }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      let interval: number;
      let attempts: number = 1;

      const tryConnect = () => {
        this._socket.connect();

        if (this.isConnected) {
          window.clearInterval(interval);
          resolve();
        } else if (attempts >= 10) {
          window.clearInterval(interval);

          const event: Event<Error> = {
            source: this.constructor.name,
            type: this.socketEvents.connectError,
            data: new Error(`Max connection attempts reached: (${attempts})`),
            severity: 'error',
          };

          this._eventsService.publish(event);
          reject(event.data);
        }
      };

      interval = window.setInterval(() => {
        attempts++;
        tryConnect();
      }, 500);

      tryConnect();
    });
  }

  public disconnect(): void {
    this._socket.disconnect();
  }

  public get socketEvents() {
    return {
      connect: 'connect',
      disconnect: 'disconnect',
      connectError: 'connect-error',
    };
  }

  public get isConnected(): boolean {
    return this._socket.connected;
  }
}
