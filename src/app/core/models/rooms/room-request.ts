import { AudioSound } from 'src/app/shared/models/audio-sound';

export interface RoomRequest {
  id?: number;
  name: string;
  number?: number;
  description?: string;
  pingSound?: AudioSound;
  organizationId: number;
}
