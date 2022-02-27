import { Role } from "../auth/role";
import { ChatMessage } from "../messages/chat-message";
import { Organization } from "../organizations/organization";

export interface User {
  id: number;
  role: Role;
  username: string;
  displayName?: string;
  isLocked: boolean;
  isOnline: boolean;
  organizationId?: number;
  preferencesJson?: string;
  
  organization?: Organization;
  chatMessages?: ChatMessage[];
}