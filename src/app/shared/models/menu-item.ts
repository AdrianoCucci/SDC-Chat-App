import { IconDefinition } from "@fortawesome/fontawesome-common-types";

export interface MenuItem {
  label?: string;
  icon?: IconDefinition;
  routerLink?: string;
  routerLinkActive?: string;
  id?: string;
  cssClass?: string;
  onClick?: (context: any) => void;
  children?: MenuItem[];
}