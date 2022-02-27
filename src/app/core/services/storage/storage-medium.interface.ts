export interface IStorageMedium {
  get(key: string): string;
  getFromJSON<T = any>(key: string): T;
  set(key: string, value: string): void;
  setToJSON(key: string, value: any): void;
  has(key: string): boolean;
  delete(key: string): boolean;
  clear(): void;
  count(): number;
}