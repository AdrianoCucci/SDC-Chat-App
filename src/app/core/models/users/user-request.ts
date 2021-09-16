import { Role } from "../auth/role";

export interface User {
  id?: number;
  role: Role;
  username: string;
  displayName?: string;
  isOnline: boolean;
  organizationId?: number;
}