import { Component } from '@angular/core';
import { RoomPing } from 'src/app/core/models/room-pings/room-ping';
import { RoomPingState } from 'src/app/core/models/room-pings/room-ping-state';
import { Room } from 'src/app/core/models/rooms/room';
import { User } from 'src/app/core/models/users/user';
import { LoginService } from 'src/app/core/services/login.service';
import { WebSocketService } from 'src/app/core/services/web-socket/web-socket.service';

@Component({
  selector: 'app-room-pings-page',
  templateUrl: './room-pings-page.component.html',
  styleUrls: ['./room-pings-page.component.scss']
})
export class RoomPingsPage {
  constructor(private _socketService: WebSocketService, private _loginService: LoginService) { }

  public get clientUser(): User {
    return this._loginService.user;
  }

  public get rooms(): Room[] {
    return this._socketService.roomPings.rooms;
  }

  public get hasRooms(): boolean {
    return this._socketService.roomPings.hasRooms;
  }

  public get activePings(): RoomPing[] {
    return this._socketService.roomPings
      .findPings((r: RoomPing) => r.state !== RoomPingState.Idle)
      .sort((a: RoomPing, b: RoomPing) => a.state - b.state);
  }
}