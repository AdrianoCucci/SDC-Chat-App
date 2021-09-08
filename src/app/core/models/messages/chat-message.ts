import { User } from "../users/user";

export interface ChatMessage {
  messageId?: number;
  contents: string;
  datePosted: Date | string;
  senderUserId: number;

  sender?: User;
}