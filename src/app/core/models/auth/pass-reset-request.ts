export interface PassResetRequest {
  userId: number;
  currentPassword: string;
  newPassword: string;
}
