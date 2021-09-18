import { Role } from "../auth/role";

export interface UserRequest {
  id?: number;
  role: Role;
  username: string;
  displayName?: string;
  isOnline: boolean;
  organizationId?: number;
}