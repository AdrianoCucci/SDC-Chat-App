import { Component } from '@angular/core';
import { Room } from 'src/app/core/models/rooms/room';
import { User } from 'src/app/core/models/users/user';
import { LoginService } from 'src/app/core/services/login.service';
import { RoomPingsService } from 'src/app/core/services/web-socket/room-pings.service';

@Component({
  selector: 'app-room-pings-page',
  templateUrl: './room-pings-page.component.html',
  styleUrls: ['./room-pings-page.component.scss']
})
export class RoomPingsPage {
  public readonly clientUser: User;

  constructor(private _pingsService: RoomPingsService, loginService: LoginService) {
    this.clientUser = loginService.user;
  }

  public get rooms(): Room[] {
    return this._pingsService.rooms;
  }

  public get hasRooms(): boolean {
    return this.rooms?.length > 0 ?? false;
  }
}