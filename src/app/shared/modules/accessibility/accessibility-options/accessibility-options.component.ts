import { Component } from '@angular/core';
import { faCircleHalfStroke, faTextHeight, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Pair } from 'src/app/shared/models/pair';
import { AccessibilityService } from '../accessibility.service';

@Component({
  selector: 'app-accessibility-options',
  templateUrl: './accessibility-options.component.html',
  styleUrls: ['./accessibility-options.component.scss']
})
export class AccessibilityOptionsComponent {
  public readonly fontSizeIcon: IconDefinition = faTextHeight;
  public readonly themeIcon: IconDefinition = faCircleHalfStroke;
  public readonly themeOptions: Pair<string, string>[] = [
    { key: "Default", value: "default" },
    { key: "High Contrast", value: "high-contrast" }
  ];

  constructor(public service: AccessibilityService) { }
}
