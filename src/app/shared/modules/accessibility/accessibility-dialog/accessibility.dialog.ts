import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-accessibility-dialog',
  templateUrl: './accessibility.dialog.html',
  styleUrls: ['./accessibility.dialog.scss']
})
export class AccessibilityDialog {
  @Input() public buttonClass: string;
  @Input() public buttonText: string = "Accessibility";
  @Input() public buttonIcon: string = "cog";
}