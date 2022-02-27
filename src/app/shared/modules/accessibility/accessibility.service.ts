import { Injectable } from "@angular/core";
import { StorageService } from "src/app/core/services/storage-service";
import { AccessibilityOptionsModel } from "./accessibility-options.model";

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  private _model: AccessibilityOptionsModel = { theme: "default" };

  constructor(private _storageService: StorageService) { }

  public update(): void {
    this.updateDOM();
    this.saveOptions();
  }

  public updateDOM(): void {
    const root: HTMLHtmlElement = document.querySelector("html");

    root.style.fontSize = this._model.fontSize != null ? `${this._model.fontSize}px` : null;
    this._model.theme ? root.setAttribute("theme", this._model.theme) : root.removeAttribute("theme");
  }

  public saveOptions(): void {
    throw new Error("Method not implemented.");
  }

  public get fontSize(): number {
    return this._model.fontSize;
  }
  public set fontSize(value: number) {
    this._model.fontSize = value;
    this.update();
  }

  public get theme(): string {
    return this._model.theme;
  }
  public set theme(value: string) {
    this._model.theme = value;
    this.update();
  }
}