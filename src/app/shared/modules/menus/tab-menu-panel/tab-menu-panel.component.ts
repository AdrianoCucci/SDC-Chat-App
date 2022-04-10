import { Component, Input } from '@angular/core';
import { MenuItem } from 'src/app/shared/models/menu-item';

@Component({
  selector: 'app-tab-menu-panel',
  templateUrl: './tab-menu-panel.component.html',
  styleUrls: ['./tab-menu-panel.component.scss']
})
export class TabMenuPanelComponent {
  @Input() public menuItems: MenuItem[];
}