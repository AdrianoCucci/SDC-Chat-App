import { Role } from "../auth/role";

export interface UserRequest {
  id?: number;
  role?: Role;
  username?: string;
  password?: string;
  displayName?: string;
  isLocked?: boolean;
  isOnline?: boolean;
  organizationId?: number;
}