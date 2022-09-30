import { EventHandler } from './event-handler.type';
import { EventSeverity } from './event-severity.type';

export interface EventSubscription<T = any> {
  eventHandler: EventHandler<T>;
  eventSources?: string | string[];
  eventTypes?: string | string[];
  eventSeverities?: EventSeverity | EventSeverity[];
}
