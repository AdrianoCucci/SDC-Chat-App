import { IStorageMedium } from './storage-medium.interface';

export class SessionStorageMedium implements IStorageMedium {
  public get(key: string): string {
    return window.sessionStorage.getItem(key);
  }

  public getFromJSON<T = any>(key: string): T {
    let value: T = null;
    const storedValue: string = this.get(key);

    if (storedValue != null) {
      value = JSON.parse(storedValue);
    }

    return value;
  }

  public set(key: string, value: string): void {
    window.sessionStorage.setItem(key, value);
  }

  public setToJSON(key: string, value: any): void {
    const storedValue: string =
      typeof value === 'string' ? value : JSON.stringify(value);
    this.set(key, storedValue);
  }

  public has(key: string): boolean {
    return window.sessionStorage.getItem(key) != null;
  }

  public delete(key: string): boolean {
    const canDelete: boolean = this.has(key);

    if (canDelete) {
      window.sessionStorage.removeItem(key);
    }

    return canDelete;
  }

  public clear(): void {
    window.sessionStorage.clear();
  }

  public count(): number {
    return window.sessionStorage.length;
  }
}
