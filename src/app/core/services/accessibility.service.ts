import { Injectable } from "@angular/core";
import { AccessibilityPrefs } from "src/app/core/models/user-prefs/accessibility-prefs.model";
import { UserPrefsService } from "src/app/core/services/user-prefs.service";

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  private readonly _prefsKey: string = "accessibility";

  private _prefs: AccessibilityPrefs;

  private _isSavingPrefs: boolean = false;

  constructor(private _userPrefsService: UserPrefsService) {
    this.loadDefaultPreferences();
  }

  public getPreferences(): AccessibilityPrefs {
    return { ...this._prefs };
  }

  public setPreferences(prefs: AccessibilityPrefs) {
    this._prefs = prefs;
    this.updateDOM();
  }

  public async savePreferences(): Promise<void> {
    try {
      this._isSavingPrefs = true;
      await this._userPrefsService.setPreference(this._prefsKey, this._prefs);
    }
    finally {
      this._isSavingPrefs = false;
    }
  }

  public loadPreferences(): void {
    const prefs: AccessibilityPrefs = this._userPrefsService.getPreference(this._prefsKey);

    if(prefs) {
      this._prefs = prefs;
      this.updateDOM();
    }
    else {
      this.loadDefaultPreferences();
    }
  }

  public loadDefaultPreferences(): void {
    this._prefs = { theme: "default" };
    this.updateDOM();
  }

  public updateDOM(prefs?: AccessibilityPrefs): void {
    prefs = prefs ?? this._prefs;
    const root: HTMLHtmlElement = document.querySelector("html");

    root.style.fontSize = prefs.fontSize != null ? `${prefs.fontSize}px` : null;
    prefs.theme ? root.setAttribute("theme", prefs.theme) : root.removeAttribute("theme");
  }

  public get fontSize(): number {
    return this._prefs.fontSize;
  }
  public set fontSize(value: number) {
    this._prefs.fontSize = value;
    this.updateDOM();
  }

  public get theme(): string {
    return this._prefs.theme;
  }
  public set theme(value: string) {
    this._prefs.theme = value;
    this.updateDOM();
  }

  public get isSavingPrefs(): boolean {
    return this._isSavingPrefs;
  }
}