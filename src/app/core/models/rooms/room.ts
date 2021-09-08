import { Organization } from "../organizations/organization";

export interface Room {
  id: number;
  name: string;
  number?: number;
  description?: string;
  organizationId: number;

  organization?: Organization;
}