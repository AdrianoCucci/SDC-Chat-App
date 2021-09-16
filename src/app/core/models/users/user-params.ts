import { Role } from "../auth/role";

export interface UserParams {
  role?: Role;
  isOnline?: boolean;
  organizationId?: number;
}