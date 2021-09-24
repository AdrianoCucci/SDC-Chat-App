import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RoomPing } from 'src/app/core/models/room-pings/room-ping';
import { RoomPingState } from 'src/app/core/models/room-pings/room-ping-state';
import { Room } from 'src/app/core/models/rooms/room';
import { User } from 'src/app/core/models/users/user';
import { RoomsService } from 'src/app/core/services/api/rooms-service';
import { LoginService } from 'src/app/core/services/login.service';
import { RoomPingsService } from 'src/app/core/services/web-socket/room-pings.service';

@Component({
  selector: 'app-room-pings-page',
  templateUrl: './room-pings-page.component.html',
  styleUrls: ['./room-pings-page.component.scss']
})
export class RoomPingsPage implements OnInit {
  public readonly clientUser: User;

  private _rooms: Room[];
  private _roomPings: RoomPing[] = [];

  private _isLoadingRooms: boolean = false;

  constructor(private _pingsService: RoomPingsService, private _roomsService: RoomsService, loginService: LoginService) {
    this.clientUser = loginService.user;
  }

  async ngOnInit(): Promise<void> {
    await this.loadRooms();
  }

  private async loadRooms(): Promise<void> {
    try {
      this._isLoadingRooms = true;
      const response: HttpResponse<Room[]> = await this._roomsService.getAllRooms({ organizationId: this.clientUser?.organizationId }).toPromise();

      this._rooms = response.body;
    }
    catch(error) {
      console.error(error);
    }
    finally {
      this._isLoadingRooms = false;
    }
  }

  public isRoomPinging(room: Room): boolean {
    return this._roomPings?.findIndex((r: RoomPing) => r.roomId === room.id && r.state === RoomPingState.Requesting) !== -1;
  }

  public findRoomPingForRoom(room: Room): RoomPing {
    return this._roomPings?.find((r: RoomPing) => r.roomId === room.id);
  }

  onPingRoom(room: Room): void {

  }


  public get rooms(): Room[] {
    return this._rooms;
  }

  public get hasRooms(): boolean {
    return this._rooms?.length > 0 ?? false;
  }

  public get isLoadingRooms(): boolean {
    return this._isLoadingRooms;
  }
}
