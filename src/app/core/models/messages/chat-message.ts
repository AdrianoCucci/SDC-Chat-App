import { Organization } from '../organizations/organization';
import { User } from '../users/user';

export interface ChatMessage {
  id?: number;
  contents: string;
  datePosted: Date | string;
  senderUserId: number;
  organizationId?: number;

  senderUser?: User;
  organization?: Organization;
}
