import { Injectable } from "@angular/core";
import { UserPrefsService } from "src/app/core/services/user-prefs.service";
import { AccessibilityOptionsModel } from "./accessibility-options.model";

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  private readonly _prefsKey: string = "accessibility";

  private _model: AccessibilityOptionsModel;
  private _debounceTimeout: number;

  constructor(private _userPrefsService: UserPrefsService) {
    this.loadDefaultPreferences();
  }

  public async savePreferences(): Promise<void> {
    await this._userPrefsService.setPreference(this._prefsKey, this._model);
  }

  public loadPreferences(): void {
    const prefs: AccessibilityOptionsModel = this._userPrefsService.getPreference(this._prefsKey);

    if(prefs) {
      this._model = prefs;
      this.updateDOM();
    }
    else {
      this.loadDefaultPreferences();
    }
  }

  private debounceSavePreferences(): void {
    this.updateDOM();

    window.clearTimeout(this._debounceTimeout);
    this._debounceTimeout = window.setTimeout(() => this.savePreferences(), 500);
  }

  public loadDefaultPreferences(): void {
    this._model = { theme: "default" };
    this.updateDOM();
  }

  public updateDOM(): void {
    const root: HTMLHtmlElement = document.querySelector("html");

    root.style.fontSize = this._model.fontSize != null ? `${this._model.fontSize}px` : null;
    this._model.theme ? root.setAttribute("theme", this._model.theme) : root.removeAttribute("theme");
  }

  public get fontSize(): number {
    return this._model.fontSize;
  }
  public set fontSize(value: number) {
    this._model.fontSize = value;
    this.debounceSavePreferences();
  }

  public get theme(): string {
    return this._model.theme;
  }
  public set theme(value: string) {
    this._model.theme = value;
    this.debounceSavePreferences();
  }
}