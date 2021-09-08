export interface RoomRequest {
  id?: number;
  name: string;
  number?: number;
  description?: string;
  organizationId: number;
}