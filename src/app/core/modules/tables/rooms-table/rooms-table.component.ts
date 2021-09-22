import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import { Room } from 'src/app/core/models/rooms/room';
import { RoomRequest } from 'src/app/core/models/rooms/room-request';
import { RoomsService } from 'src/app/core/services/api/rooms-service';
import { AudioService } from 'src/app/core/services/audio.service';
import { enumToPairs } from 'src/app/shared/functions/enum-to-pairs';
import { parseHttpError } from 'src/app/shared/functions/parse-http-error';
import { AudioSound } from 'src/app/shared/models/audio-sound';
import { FormMode } from 'src/app/shared/models/form-mode';
import { Pair } from 'src/app/shared/models/pair';
import { TableCell } from 'src/app/shared/modules/table/table-cell';
import { Table } from 'src/app/shared/modules/table/table.component';
import { RoomForm } from '../../forms/room-form/room-form.component';

@Component({
  selector: 'app-rooms-table',
  templateUrl: './rooms-table.component.html',
  styleUrls: ['./rooms-table.component.scss']
})
export class RoomsTable {
  @Input() public rooms: Room[];
  @Input() public organizationId: number;

  public readonly pingSoundPairs: Pair<string, AudioSound>[] = enumToPairs(AudioSound, true);
  public readonly pingSoundIcon: IconDefinition = faVolumeUp;
  public readonly cells: TableCell[] = [
    { name: "Name", prop: "name", sortable: true, filterable: true },
    { name: "Number", prop: "number", type: "number", sortable: true, filterable: true },
    { name: "Description", prop: "description", width: 700, sortable: true, filterable: true },
    {
      name: "Ping Sound",
      prop: "pingSound",
      sortable: true,
      filterable: true,
      type: "select",
      selectOptions: {
        options: this.pingSoundPairs,
        displayKey: "key",
        valueKey: "value"
      }
    }
  ];

  public errorDialogVisible: boolean = false;
  public errorDialogText: string;

  @ViewChild(Table) private readonly _table: Table;
  @ViewChild(RoomForm) private readonly _roomForm: RoomForm;

  private _isDeletingRoom: boolean = false;

  constructor(private _roomsService: RoomsService, private _audioService: AudioService) { }

  public getPingSoundName(audioSound: AudioSound) {
    return this.pingSoundPairs.find((p: Pair<string, AudioSound>) => p.value === audioSound)?.key ?? null;
  }

  onPlayPingSound(audioSound: AudioSound): void {
    this._audioService.play(audioSound);
  }

  onAddRoom(): void {
    const request: RoomRequest = { organizationId: this.organizationId } as any;
    this.showRoomForm(request, "add");
  }

  onEditRoom(room: Room): void {
    const request: RoomRequest = { ...room };
    this.showRoomForm(request, "edit");
  }

  onRoomFormSubmit(room: Room): void {
    // this._roomForm.dialogVisible = false;

    // switch(this._roomForm.mode) {
    //   case "add":
    //     this.rooms = this._table.addRow(room);
    //     break;

    //   case "edit":
    //     this.rooms = this._table.querySetRow(room, (u: Room) => u.id === room.id);
    //     break;
    // }
  }

  async onDeleteRoom(room: Room): Promise<void> {
    try {
      this._isDeletingRoom = true;

      await this._roomsService.deleteRoom(room.id).toPromise();
      this.rooms = this._table.queryDeleteRow((u: Room) => u.id === room.id);
    }
    catch(error) {
      this.errorDialogText = parseHttpError(error as HttpErrorResponse, true) as string;
      this.errorDialogVisible = true;
    }
    finally {
      this._isDeletingRoom = false;
    }
  }

  private showRoomForm(model: RoomRequest, mode: FormMode) {
    this._roomForm.clear();

    setTimeout(() => {
      this._roomForm.model = model;
      this._roomForm.mode = mode;
      
      this._roomForm.organizationId = this.organizationId;
      this._roomForm.pingSoundOptions = this.pingSoundPairs;
     
      this._roomForm.dialogVisible = true;
    });
  }

  public get isDeletingRoom(): boolean {
    return this._isDeletingRoom;
  }
}
