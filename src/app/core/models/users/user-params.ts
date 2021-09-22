import { Role } from "../auth/role";

export interface UserParams {
  role?: Role;
  isLocked?: boolean;
  isOnline?: boolean;
  organizationId?: number;
}