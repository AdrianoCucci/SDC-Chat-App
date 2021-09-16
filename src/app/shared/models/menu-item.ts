export interface MenuItem {
  label?: string;
  icon?: string;
  routerLink?: string;
  routerLinkActive?: string;
  id?: string;
  cssClass?: string;
  onClick?: (context: any) => void;
  children?: MenuItem[];
}