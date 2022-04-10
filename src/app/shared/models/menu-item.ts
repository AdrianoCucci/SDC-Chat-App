import { TemplateRef } from "@angular/core";
import { CommonIcon } from "./common-icon.type";

export interface MenuItem {
  label?: string;
  icon?: CommonIcon;
  description?: string;
  routerLink?: string;
  routerLinkActive?: string;
  id?: string;
  cssClass?: string;
  disabled?: boolean;
  data?: any;
  onClick?: (context?: any) => void;
  children?: MenuItem[];
  template?: TemplateRef<any>;
}