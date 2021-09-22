import { RoomPingSound } from "./room-ping-sound";

export interface RoomRequest {
  id?: number;
  name: string;
  number?: number;
  description?: string;
  pingSound?: RoomPingSound;
  organizationId: number;
}