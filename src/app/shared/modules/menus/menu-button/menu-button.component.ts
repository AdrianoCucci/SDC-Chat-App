import { Component, EventEmitter, HostBinding, Input, Output, ViewChild } from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { getCommonIconDefinition } from 'src/app/shared/functions/get-common-icon-definition';
import { MenuItem } from 'src/app/shared/models/menu-item';

@Component({
  selector: 'app-menu-button',
  templateUrl: './menu-button.component.html',
  styleUrls: ['./menu-button.component.scss']
})
export class MenuButtonComponent {
  @Output() public readonly onClick = new EventEmitter<MenuItem>();

  @Input() public item: MenuItem;
  @Input() public templateOverwrite: boolean = false;

  @ViewChild(RouterLinkActive) private readonly _routerLinkActive: RouterLinkActive;

  ngAfterViewInit() {
    console.log(this._routerLinkActive);
  }

  public getItemIconDefinition(menuItem: MenuItem): IconDefinition {
    return getCommonIconDefinition(menuItem.icon);
  }

  onClickInternal(): void {
    if(this.item?.onClick != null) {
      this.item.onClick(this.item);
      this.onClick.emit(this.item);
    }
  }

  @HostBinding("class.active") public get active(): boolean {
    return this._routerLinkActive?.isActive ?? false;
  }

  @HostBinding("class.disabled") public get disabled(): boolean {
    return this.item?.disabled ?? false;
  }
}
