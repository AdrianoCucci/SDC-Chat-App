import { ChatMessage } from "../messages/chat-message";
import { Room } from "../rooms/room";
import { User } from "../users/user";

export interface Organization {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  street: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  fullAddress: string;

  users?: User[];
  rooms?: Room[];
  chatMessages?: ChatMessage[];
}