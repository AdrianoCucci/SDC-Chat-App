import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Room } from 'src/app/core/models/rooms/room';
import { RoomsService } from 'src/app/core/services/api/rooms-service';
import { LoginService } from 'src/app/core/services/login.service';
import { parseHttpError } from 'src/app/shared/functions/parse-http-error';
import { PagedList } from 'src/app/shared/models/pagination/paged-list';

@Component({
  selector: 'app-rooms-page',
  templateUrl: './rooms-page.component.html',
  styleUrls: ['./rooms-page.component.scss']
})
export class RoomsPage implements OnInit {
  public readonly organizationId: number;

  public loadingVisible: boolean = false;
  public loadError: string;
  public errorVisible: boolean = false;

  private _rooms: PagedList<Room>;

  constructor(private _roomsService: RoomsService, loginService: LoginService) {
    this.organizationId = loginService.user.organizationId;
  }

  async ngOnInit(): Promise<void> {
    try {
      this.loadingVisible = true;

      const response: HttpResponse<PagedList<Room>> = await this._roomsService.getAllRooms({ organizationId: this.organizationId }).toPromise();
      this._rooms = response.body;
    }
    catch(error) {
      this.loadError = parseHttpError(error as HttpErrorResponse, true) as string;
      this.errorVisible = true;
    }
    finally {
      this.loadingVisible = false;
    }
  }

  public get rooms(): PagedList<Room> {
    return this._rooms;
  }
}