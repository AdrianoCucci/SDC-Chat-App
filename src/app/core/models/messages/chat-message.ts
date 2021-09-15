import { User } from "../users/user";

export interface ChatMessage {
  id?: number;
  contents: string;
  datePosted: Date | string;
  senderUserId: number;
  organizationId?: number;

  sender?: User;
}