export interface Event<T = any> {
  type: string;
  source: string;
  subject?: string;
  data?: T;
  timestamp?: Date;
}