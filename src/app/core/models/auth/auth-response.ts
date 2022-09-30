import { User } from '../users/user';

export interface AuthResponse {
  isSuccess: boolean;
  message?: string;
  token?: string;
  user?: User;
}
