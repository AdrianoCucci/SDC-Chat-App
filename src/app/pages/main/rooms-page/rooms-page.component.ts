import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, defer, throwError } from 'rxjs';
import { finalize, catchError, map, tap } from 'rxjs/operators';
import { Room } from 'src/app/core/models/rooms/room';
import { RoomsService } from 'src/app/core/services/api/rooms-service';
import { LoginService } from 'src/app/core/services/login.service';
import { parseErrorMessage } from 'src/app/shared/functions/parse-http-error';
import { PagedList } from 'src/app/shared/models/pagination/paged-list';
import { Paginatable } from 'src/app/shared/models/pagination/paginatable';
import { PageEvent } from 'src/app/shared/modules/table/page-event';

@Component({
  selector: 'app-rooms-page',
  templateUrl: './rooms-page.component.html',
  styleUrls: ['./rooms-page.component.scss'],
})
export class RoomsPage implements OnInit {
  public readonly organizationId: number;

  public readonly pageHandler = (
    event: PageEvent
  ): Observable<PagedList<Room>> =>
    this.loadRooms({
      take: event.limit,
      skip: event.offset * event.limit,
    });

  public loadingVisible: boolean = false;
  public loadError: string;
  public errorVisible: boolean = false;

  private _rooms: PagedList<Room>;

  constructor(private _roomsService: RoomsService, loginService: LoginService) {
    this.organizationId = loginService.user.organizationId;
  }

  ngOnInit(): void {
    this.loadRooms().subscribe();
  }

  private loadRooms(pagination?: Paginatable): Observable<PagedList<Room>> {
    return defer((): Observable<PagedList<Room>> => {
      this.loadingVisible = true;
      this.errorVisible = false;

      return this._roomsService
        .getAllRooms({
          organizationId: this.organizationId,
          skip: pagination?.skip,
          take: pagination?.take,
        })
        .pipe(
          finalize(() => (this.loadingVisible = false)),
          catchError((error: any) => {
            this.loadError = parseErrorMessage(error);
            this.errorVisible = true;

            return throwError(error);
          }),
          map((value: HttpResponse<PagedList<Room>>) => value.body),
          tap((value: PagedList<Room>) => (this._rooms = value))
        );
    });
  }

  public get rooms(): PagedList<Room> {
    return this._rooms;
  }
}
