import { EventSeverity } from "./event-severity.type";

export interface Event<T = any> {
  type: string;
  source: string;
  severity?: EventSeverity;
  data?: T;
  timestamp?: Date;
}