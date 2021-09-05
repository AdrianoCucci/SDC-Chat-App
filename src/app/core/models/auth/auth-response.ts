import { User } from "../user";

export interface AuthResponse {
  isSuccess: boolean;
  message?: string;
  token?: string;
  user?: User;
}