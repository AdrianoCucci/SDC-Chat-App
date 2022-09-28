import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { MenuItem } from 'src/app/shared/models/menu-item';

@Component({
  selector: 'app-tab-menu-panel',
  templateUrl: './tab-menu-panel.component.html',
  styleUrls: ['./tab-menu-panel.component.scss'],
})
export class TabMenuPanelComponent {
  @Output() public readonly onItemClick = new EventEmitter<MenuItem>();

  @Input() public menuItems: MenuItem[];
  @Input() public templateOverwrite: boolean = false;
  @Input() @HostBinding('attr.menu-slot') public menuSlot:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right' = 'top';
  @Input() @HostBinding('class.menu-accent') public menuAccent: boolean = true;
}
