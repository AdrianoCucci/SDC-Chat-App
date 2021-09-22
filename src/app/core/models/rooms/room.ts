import { AudioSound } from "src/app/shared/models/audio-sound";
import { Organization } from "../organizations/organization";

export interface Room {
  id: number;
  name: string;
  number?: number;
  description?: string;
  pingSound?: AudioSound;
  organizationId: number;

  organization?: Organization;
}