import { Room } from "../rooms/room";
import { User } from "../users/user";
import { RoomPingState } from "./room-ping-state";

export interface RoomPing {
  guid?: string;
  state: RoomPingState;
  roomId: number;
  organizationId: number;
  requestDate: Date | string;
  requestMessage: string;
  responseMessage?: string;
  requestUserId: number;
  responseUserId?: number;

  room?: Room;
  requestUser?: User;
  responseUser?: User;
}