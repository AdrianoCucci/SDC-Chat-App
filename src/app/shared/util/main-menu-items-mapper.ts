import { faBuilding, faComments, faDoorOpen, faExclamation, faUsers } from "@fortawesome/free-solid-svg-icons";
import { Role } from "src/app/core/models/auth/role";
import { MAIN_PATHS } from "../app-paths";
import { MenuItem } from "../models/menu-item";

export class MainMenuItemsMapper {
  public getMenuItemsByRole(...roles: Role[]): MenuItem[] {
    const itemsMap: Map<Role, MenuItem[]> = this.getRoleMenuItemsMap();
    let menuItems: MenuItem[] = [];

    itemsMap.forEach((values: MenuItem[], key: Role) => {
      if(roles.includes(key)) {
        menuItems = menuItems.concat(values);
      }
    });

    return menuItems;
  }

  public getRoleMenuItemsMap(): Map<Role, MenuItem[]> {
    const map = new Map<Role, MenuItem[]>([
      [Role.Administrator, this.getAdminMenuItems()],
      [Role.OrganizationAdmin, this.getOrganizationAdminMenuItems()],
      [Role.User, this.getUserMenuItems()]
    ]);

    return map;
  }

  public getAdminMenuItems(): MenuItem[] {
    const root: string = `/${MAIN_PATHS.root}/`;
    const children = MAIN_PATHS.children;

    return [
      {
        routerLink: root + children.organizations,
        label: "Organizations",
        icon: faBuilding
      },
      {
        routerLink: root + children.users,
        label: "Users",
        icon: faUsers
      }
    ];
  }

  public getOrganizationAdminMenuItems(): MenuItem[] {
    const root: string = `/${MAIN_PATHS.root}/`;
    const children = MAIN_PATHS.children;

    return [
      {
        routerLink: root + children.rooms,
        label: "Rooms",
        icon: faDoorOpen
      },
      {
        routerLink: root + children.chat,
        label: "Chat",
        icon: faComments
      },
      {
        routerLink: root + children.pings,
        label: "Room Pings",
        icon: faExclamation
      }
    ];
  }

  public getUserMenuItems(): MenuItem[] {
    const root: string = `/${MAIN_PATHS.root}/`;
    const children = MAIN_PATHS.children;

    return [
      {
        routerLink: root + children.chat,
        label: "Chat",
        icon: faComments
      },
      {
        routerLink: root + children.pings,
        label: "Room Pings",
        icon: faExclamation
      }
    ];
  }
}