import { User } from "../user";

export interface ChatMessage {
  messageId?: number;
  contents: string;
  datePosted: Date | string;
  senderUserId: number;

  sender?: User;
}