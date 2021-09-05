import { Component, HostBinding, Input } from '@angular/core';

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
  @Input() @HostBinding("class.disabled") public disabled: boolean = false;
  @Input() @HostBinding("class.block") public block: boolean = false;

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
}

type RenderType = "button" | "router-link" | "anchor";