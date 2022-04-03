import { Injectable } from "@angular/core";
import { EventHandler } from "./event-handler.type";
import { EventSubscription } from "./event-subscription.model";
import { Event } from "./event.model";

@Injectable({ providedIn: 'root' })
export class EventsService {
  private readonly _subscriptions: EventSubscription[] = [];

  public subscribe(subscription: EventSubscription): EventSubscription {
    if(!subscription) {
      throw new Error("[subscription] must have a value");
    }
    if(subscription.eventHandler == null) {
      throw new Error("[subscription] must have an [eventHandler] value");
    }

    const currentSubscriptions: EventSubscription[] = this._subscriptions;
    if(!currentSubscriptions.includes(subscription)) {
      currentSubscriptions.push(subscription);
    }

    return subscription;
  }

  public subscribeAll(eventHandler: EventHandler): EventSubscription {
    return this.subscribe({ eventHandler });
  }

  public unsubscribe(subscription: EventSubscription): boolean {
    const currentSubscriptions: EventSubscription[] = this._subscriptions;
    const index: number = currentSubscriptions.indexOf(subscription);
    const canUnsubscribe: boolean = index !== -1;

    if(canUnsubscribe) {
      currentSubscriptions.splice(index, 1);
    }

    return canUnsubscribe;
  }

  public unsubscribeAll(): void {
    this._subscriptions.splice(0, this._subscriptions.length);
  }

  public publish<T = any>(event: Event<T>): void {
    if(!event) {
      throw new Error("[event] must have a value");
    }

    event.severity = event.severity ?? "info";
    event.timestamp = event.timestamp ?? new Date();

    this._subscriptions.forEach((e: EventSubscription) => {
      if(this.canInvokeEventSubscription(e, event)) {
        e.eventHandler(event);
      }
    });
  }

  private compareInvokeFilter(value: any | any[], comparedValue: any): boolean {
    let result: boolean = true;

    if(value != null) {
      result = Array.isArray(value) ? value.includes(comparedValue) : value === comparedValue;
    }

    return result;
  }

  private canInvokeEventSubscription(subscription: EventSubscription, event: Event): boolean {
    const result: boolean =
      this.compareInvokeFilter(subscription.eventSources, event.source) &&
      this.compareInvokeFilter(subscription.eventTypes, event.type) &&
      this.compareInvokeFilter(subscription.eventSeverities, event.severity);

    return result;
  }
}