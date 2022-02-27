import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-accessibility-popover',
  templateUrl: './accessibility.popover.html',
  styleUrls: ['./accessibility.popover.scss']
})
export class AccessibilityPopover {
  @Input() public buttonClass: string;
  @Input() public buttonText: string = "Accessibility";
  @Input() public buttonIcon: string = "cog";
}