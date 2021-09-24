import { Room } from "../rooms/room";
import { User } from "../users/user";
import { RoomPingState } from "./room-ping-state";

export interface RoomPing {
  state: RoomPingState;
  roomId: number;
  requestDate: Date | string;
  requestMessage: string;
  responseMessage?: string;
  requestUserId: number;
  responseUserId?: number;

  room?: Room;
  requestUser?: User;
  responseUser?: User;
}