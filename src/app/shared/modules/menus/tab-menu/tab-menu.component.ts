import { AfterViewInit, Component, ContentChildren, EventEmitter, Input, Output, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { getCommonIconDefinition } from 'src/app/shared/functions/get-common-icon-definition';
import { MenuItem } from 'src/app/shared/models/menu-item';
import { TemplateDirective } from '../../directives/template.directive';

@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.scss']
})
export class TabMenu implements AfterViewInit {
  @Output() public readonly onItemClick = new EventEmitter<MenuItem>();

  @Input() public menuItems: MenuItem[];
  @Input() public templateOverwrite: boolean = false;

  @ContentChildren(TemplateDirective) private readonly _templates: QueryList<TemplateDirective>;

  constructor(private _router: Router) { }

  ngAfterViewInit(): void {
    if(this.hasMenuItems) {
      setTimeout(() => this._templates.forEach((directive: TemplateDirective) => {
        const id: string = directive.name;
        const menuItem: MenuItem = this.menuItems.find((m: MenuItem) => m.id === id);

        if(menuItem != null) {
          menuItem.template = directive.template;
        }
      }));
    }
  }

  public getItemIconDefinition(menuItem: MenuItem): IconDefinition {
    return getCommonIconDefinition(menuItem.icon);
  }

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