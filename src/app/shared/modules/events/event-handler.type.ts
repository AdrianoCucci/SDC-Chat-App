import { Event } from './event.model';

export type EventHandler<T = any> = (event: Event<T>) => any;
