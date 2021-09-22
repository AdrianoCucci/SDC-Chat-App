import { HttpResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Room } from 'src/app/core/models/rooms/room';
import { RoomRequest } from 'src/app/core/models/rooms/room-request';
import { RoomsService } from 'src/app/core/services/api/rooms-service';
import { AudioSound } from 'src/app/shared/models/audio-sound';
import { Pair } from 'src/app/shared/models/pair';
import { AppForm } from '../app-form';

@Component({
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.scss']
})
export class RoomForm extends AppForm<RoomRequest, Room> {
  @Input() public organizationId: number;
  @Input() public pingSoundOptions: Pair<string, AudioSound>[];

  constructor(private _roomsService: RoomsService) {
    super();
  }

  protected async onRequestAdd(model: RoomRequest): Promise<Room> {
    model.organizationId = this.organizationId;
    const response: HttpResponse<Room> = await this._roomsService.addRoom(model).toPromise();

    return response.body;
  }

  protected async onRequestUpdate(model: RoomRequest): Promise<Room> {
    model.organizationId = this.organizationId;
    const response: HttpResponse<Room> = await this._roomsService.updateRoom(model.id, model).toPromise();

    return response.body;
  }
}
