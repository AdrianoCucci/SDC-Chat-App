import { Injectable } from "@angular/core";
import { LocalStorageMedium } from "./local-storage-medium";
import { SessionStorageMedium } from "./session-storage-medium";
import { IStorageMedium } from "./storage-medium.interface";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public readonly session = new SessionStorageMedium();
  public readonly local = new LocalStorageMedium();

  public getAllMediums(): IStorageMedium[] {
    return [this.session, this.local];
  }

  public forEachMedium(action: (storageMedium: IStorageMedium) => void): void {
    if(action) {
      const mediums: IStorageMedium[] = this.getAllMediums();

      for(let i = 0; i < mediums.length; i++) {
        action(mediums[i]);
      }
    }
  }

  public mapEachMedium<T = any>(action: (storageMedium: IStorageMedium) => T): T[] {
    let result: T[];

    if(action) {
      const mediums: IStorageMedium[] = this.getAllMediums();
      result = mediums.map((s: IStorageMedium) => action(s));
    }

    return result;
  }
}