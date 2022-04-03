import { Injectable } from "@angular/core";
import { EventHandler } from "./event-handler.type";
import { EventSubscription } from "./event-subscription.model";
import { Event } from "./event.model";

@Injectable({ providedIn: 'root' })
export class EventsService {
  private readonly _subscriptions: EventSubscription[] = [];

  public subscribe(subscription: EventSubscription): void {
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
  }

  public subscribeAll(eventHandler: EventHandler): void {
    this.subscribe({ eventHandler });
  }

  public unsubscribe(eventHandler: EventHandler): boolean {
    const currentSubscriptions: EventSubscription[] = this._subscriptions;
    const subscriptions: EventSubscription[] = currentSubscriptions.filter((e: EventSubscription) => e.eventHandler === eventHandler);
    const canUnsubscribe: boolean = subscriptions?.length > 0;

    if(canUnsubscribe) {
      subscriptions.forEach((e: EventSubscription) => {
        const index: number = currentSubscriptions.indexOf(e);
        currentSubscriptions.splice(index, 1);
      });
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
    if(!event.timestamp) {
      event.timestamp = new Date();
    }

    const currentSubscriptions: EventSubscription[] = this._subscriptions;
    currentSubscriptions.forEach((e: EventSubscription) => {
      const canInvoke: boolean =
        (!e.eventSource || e.eventSource === event.source) &&
        (!e.eventType || e.eventType === event.type);

      if(canInvoke) {
        e.eventHandler.call(this, event);
      }
    });
  }
}