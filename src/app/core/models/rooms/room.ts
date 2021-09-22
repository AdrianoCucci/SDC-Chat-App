import { Organization } from "../organizations/organization";
import { RoomPingSound } from "./room-ping-sound";

export interface Room {
  id: number;
  name: string;
  number?: number;
  description?: string;
  pingSound?: RoomPingSound;
  organizationId: number;

  organization?: Organization;
}