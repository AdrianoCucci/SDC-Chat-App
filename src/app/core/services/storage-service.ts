import { Injectable } from "@angular/core";
import { EncryptService } from "./encrypt-service";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private _encryptService: EncryptService) { }

  public setSession(key: string, value: any): void {
    const storedValue: string = typeof value === "string" ? value : JSON.stringify(value);
    window.sessionStorage.setItem(key, storedValue);
  }

  public setSessionEncrypted(key: string, value: any): void {
    const encryptedValue: string = this._encryptService.encrypt(JSON.stringify(value));
    this.setSession(key, encryptedValue);
  }

  public getSession<T = any>(key: string): T {
    let value: T = null;
    const storedValue: string = window.sessionStorage.getItem(key);

    if(storedValue != null) {
      value = JSON.parse(storedValue);
    }

    return value;
  }

  public getSessionDecrypted<T = any>(key: string): T {
    let value: T = null;
    let storedValue: string = window.sessionStorage.getItem(key);

    if(storedValue != null) {
      storedValue = this._encryptService.decrypt(storedValue);
      value = JSON.parse(storedValue);
    }

    return value;
  }
}