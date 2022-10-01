import { HttpResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Room } from 'src/app/core/models/rooms/room';
import { RoomRequest } from 'src/app/core/models/rooms/room-request';
import { RoomsService } from 'src/app/core/services/api/rooms-service';
import { AudioService } from 'src/app/core/services/audio/audio.service';
import { AudioSound } from 'src/app/shared/models/audio-sound';
import { Pair } from 'src/app/shared/models/pair';
import { AppForm } from '../app-form';

@Component({
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.scss'],
})
export class RoomForm extends AppForm<RoomRequest, Room> {
  @Input() public organizationId: number;
  @Input() public pingSoundOptions: Pair<string, AudioSound>[];

  constructor(
    private _roomsService: RoomsService,
    private _audioService: AudioService
  ) {
    super();
  }

  protected override onRequestAdd(model: RoomRequest): Observable<Room> {
    model.organizationId = this.organizationId;

    return this._roomsService
      .addRoom(model)
      .pipe(map((response: HttpResponse<Room>) => response.body));
  }

  protected override onRequestUpdate(model: RoomRequest): Observable<Room> {
    model.organizationId = this.organizationId;

    return this._roomsService
      .updateRoom(model.id, model)
      .pipe(map((response: HttpResponse<Room>) => response.body));
  }

  async onPreviewSound(audioSound: AudioSound): Promise<void> {
    await this._audioService.playOneShot(audioSound);
  }
}
