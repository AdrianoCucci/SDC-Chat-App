import { IconDefinition } from "@fortawesome/fontawesome-common-types";

export interface MenuItem {
  label?: string;
  icon?: IconDefinition;
  description?: string;
  routerLink?: string;
  routerLinkActive?: string;
  id?: string;
  cssClass?: string;
  disabled?: boolean;
  data?: any;
  onClick?: (context: any) => void;
  children?: MenuItem[];
}