import { Component, OnDestroy, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faTextHeight, faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { AccessibilityPrefs } from 'src/app/core/models/user-prefs/accessibility-prefs.model';
import { Pair } from 'src/app/shared/models/pair';
import { AccessibilityService } from 'src/app/core/services/accessibility.service';

@Component({
  selector: 'app-accessibility',
  templateUrl: './accessibility.page.html',
  styleUrls: ['./accessibility.page.scss']
})
export class AccessibilityPage implements OnInit, OnDestroy {
  public readonly fontSizeIcon: IconDefinition = faTextHeight;
  public readonly themeIcon: IconDefinition = faCircleHalfStroke;
  public readonly themeOptions: Pair<string, string>[] = [
    { key: "Default", value: "default" },
    { key: "High Contrast", value: "high-contrast" }
  ];

  private _currentPrefs: AccessibilityPrefs;

  constructor(public service: AccessibilityService) { }

  ngOnInit(): void {
    this._currentPrefs = this.service.getPreferences();
  }

  ngOnDestroy(): void {
    if(!this.isSaving) {
      this.service.setPreferences(this._currentPrefs);
    }
  }

  async onSave(): Promise<void> {
    await this.service.savePreferences();
    this._currentPrefs = this.service.getPreferences();
  }

  public get isSaving(): boolean {
    return this.service.isSavingPrefs;
  }
}