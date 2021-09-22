import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'src/app/shared/models/menu-item';

@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.scss']
})
export class TabMenu {
  @Output() public readonly onItemClick = new EventEmitter<MenuItem>();

  @Input() public menuItems: MenuItem[];
  @Input() public itemTemplate: TemplateRef<any>;

  constructor(private _router: Router) { }

  public async navigateToMenuItem(menuItem: MenuItem): Promise<void> {
    if(this.menuItems?.includes(menuItem) && menuItem.routerLink != null) {
      await this._router.navigateByUrl(menuItem.routerLink);
    }
  }

  onItemClickInternal(item: MenuItem): void {
    this.onItemClick.emit(item);

    if(item.onClick != null) {
      item.onClick(item);
    }
  }

  public get hasMenuItems(): boolean {
    return this.menuItems?.length > 0 ?? false;
  }
}