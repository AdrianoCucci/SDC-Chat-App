import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WebSocketService } from 'src/app/core/services/web-socket/web-socket.service';
import { EventSubscription } from 'src/app/shared/modules/events/event-subscription.model';
import { Event } from 'src/app/shared/modules/events/event.model';
import { EventsService } from 'src/app/shared/modules/events/events.service';
import { Toast } from 'src/app/shared/modules/overlays/toast/toast';
import { ToastOptions } from 'src/app/shared/modules/overlays/toast/toast-options.model';
import { ToastOverlay } from 'src/app/shared/modules/overlays/toast/toast.overlay';

@Component({
  selector: 'app-web-socket-alerts-overlay',
  templateUrl: './web-socket-alerts.overlay.html',
  styleUrls: ['./web-socket-alerts.overlay.scss']
})
export class WebSocketAlertsOverlay implements OnInit, OnDestroy {
  @ViewChild(ToastOverlay) private readonly _toastOverlay: ToastOverlay;

  private readonly _eventTypes = {
    connect: "connect",
    connectError: "connect-error"
  };

  private _eventSubscription?: EventSubscription;
  private _didLoseConnection: boolean = false;
  private _currentToast?: Toast;

  constructor(private _eventsService: EventsService) { }

  ngOnInit(): void {
    this._eventSubscription = this._eventsService.subscribe({
      eventSources: WebSocketService.name,
      eventTypes: [this._eventTypes.connect, this._eventTypes.connectError],
      eventHandler: (event: Event) => this.onEvent(event)
    });
  }

  ngOnDestroy() {
    this._eventsService.unsubscribe(this._eventSubscription);
    this._eventSubscription = undefined;
  }

  private onEvent(event: Event): void {
    switch(event.type) {
      case this._eventTypes.connect:
        this.onConnect();
        break;
      case this._eventTypes.connectError:
        this.onConnectError();
        break;
    }
  }

  private onConnect(): void {
    if(this._didLoseConnection) {

      this.showToast({
        text: "Reconnected successfully",
        icon: "check",
        class: "success",
        alignX: "end",
        alignY: "end",
        dismissButton: true
      });
    }
  }

  private onConnectError(): void {
    this._didLoseConnection = true;

    if(!this._currentToast) {
      this.showToast({
        text: "Connection lost, attempting to reconnect...",
        icon: "circle-exclamation",
        class: "error",
        alignX: "end",
        alignY: "end",
        dismissButton: true,
        duration: 0
      });
    }
  }

  private showToast(options: ToastOptions): void {
    this._currentToast?.dismiss();

    this._currentToast = this._toastOverlay.createToast({
      ...options,
      onDismiss: () => this._currentToast = undefined
    });
  }
}
