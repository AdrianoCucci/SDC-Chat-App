import { Component } from '@angular/core';
import { RoomPing } from 'src/app/core/models/room-pings/room-ping';
import { RoomPingState } from 'src/app/core/models/room-pings/room-ping-state';
import { Room } from 'src/app/core/models/rooms/room';
import { User } from 'src/app/core/models/users/user';
import { LoginService } from 'src/app/core/services/login.service';
import { RoomPingsService } from 'src/app/core/services/web-socket/room-pings.service';
import { PagedList } from 'src/app/shared/models/pagination/paged-list';

@Component({
  selector: 'app-room-pings-page',
  templateUrl: './room-pings-page.component.html',
  styleUrls: ['./room-pings-page.component.scss'],
})
export class RoomPingsPage {
  constructor(
    private _roomPingsService: RoomPingsService,
    private _loginService: LoginService
  ) {}

  public get clientUser(): User {
    return this._loginService.user;
  }

  public get rooms(): PagedList<Room> {
    return this._roomPingsService.rooms;
  }

  public get hasRooms(): boolean {
    return this._roomPingsService.hasRooms;
  }

  public get activePings(): RoomPing[] {
    return this._roomPingsService
      .findPings((r: RoomPing) => r.state !== RoomPingState.Idle)
      .sort((a: RoomPing, b: RoomPing) => a.state - b.state);
  }
}
