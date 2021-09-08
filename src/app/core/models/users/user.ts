import { RoleType } from "../auth/role-type";
import { Organization } from "../organizations/organization";

export interface User {
  id: number;
  role: RoleType;
  username: string;
  displayName?: string;
  isOnline: boolean;
  organizationId?: number;
  
  organization?: Organization;
}