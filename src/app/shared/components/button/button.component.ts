import { Component, HostBinding, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { getCommonFaIcon } from '../../functions/get-common-fa-icon';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class Button {
  @Input() public type: string = "button";
  @Input() public text: string;
  @Input() public href: string;
  @Input() public routerLink: string | any[];
  @Input() public routerLinkActive: string;
  @Input() public iconPos: "start" | "end";
  @Input() @HostBinding("class.disabled") public disabled: boolean = false;

  private _icon: ButtonIcon;
  private _iconDefinition: IconDefinition;

  private updateIconDefinition(icon: ButtonIcon) {
    if(typeof icon !== "string") {
      this._iconDefinition = icon;
    }
    else {
      this._iconDefinition = getCommonFaIcon(icon);
    }
  }

  public get renderType(): RenderType {
    let type: RenderType;

    if(this.routerLink) {
      type = "router-link";
    }
    else if(this.href) {
      type = "anchor";
    }
    else {
      type = "button";
    }

    return type;
  }

  public get icon(): ButtonIcon {
    return this._icon;
  }
  @Input() public set icon(value: ButtonIcon) {
    this._icon = value;
    this.updateIconDefinition(this._icon);
  }

  public get iconDefinition(): IconDefinition {
    return this._iconDefinition;
  }
}

type RenderType = "button" | "router-link" | "anchor";
type ButtonIcon = IconDefinition | string;