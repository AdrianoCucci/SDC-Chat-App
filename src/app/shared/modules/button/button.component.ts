import { Component, HostBinding, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { getCommonIconDefinition } from '../../functions/get-common-icon-definition';
import { CommonIcon } from '../../models/common-icon.type';

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

  private _icon: IconDefinition;

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

  public get icon(): IconDefinition {
    return this._icon;
  }
  @Input() public set icon(value: CommonIcon) {
    this._icon = getCommonIconDefinition(value);
  }
}

type RenderType = "button" | "router-link" | "anchor";