import { AudioSound } from "src/app/shared/models/audio-sound";

export interface RoomParams {
  pingSound?: AudioSound;
  organizationId?: number;
}