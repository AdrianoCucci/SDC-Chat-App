import { RoleType } from "./auth/role-type";

export interface User {
  userId?: number;
  role: RoleType;
  username: string;
  displayName?: string;
  isOnline: boolean;
}