import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
  public readonly rooms$: Observable<Room[]> =
    this._roomPingsService.rooms$.pipe(
      map((value: PagedList<Room>) => value.data)
    );

  public readonly activePings$: Observable<RoomPing[]> =
    this._roomPingsService.pings$.pipe(
      map((value: RoomPing[]) =>
        value
          .filter((r: RoomPing) => r.state !== RoomPingState.Idle)
          .sort((a: RoomPing, b: RoomPing) => a.state - b.state)
      )
    );

  constructor(
    private _roomPingsService: RoomPingsService,
    private _loginService: LoginService
  ) {}

  public get clientUser(): User {
    return this._loginService.user;
  }
}
