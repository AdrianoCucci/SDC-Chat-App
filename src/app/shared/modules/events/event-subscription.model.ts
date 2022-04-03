import { EventHandler } from "./event-handler.type";

export interface EventSubscription<T = any> {
  eventHandler: EventHandler<T>;
  eventSource?: string;
  eventType?: string;
}