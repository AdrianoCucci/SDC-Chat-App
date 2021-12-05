import { ChatMessage } from "./chat-message";

export interface ChatMessageQuery extends Partial<ChatMessage> {
  minDate?: Date | string;
  maxDate?: Date | string;
}