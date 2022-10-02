import { Injectable } from '@angular/core';
import { Observable, defer, concat, merge, throwError } from 'rxjs';
import { catchError, filter, last, switchMap, takeUntil } from 'rxjs/operators';
import { User } from '../../models/users/user';
import { ChatService } from './chat.service';
import { RoomPingsService } from './room-pings.service';
import { SocketUsersService } from './socket-users.service';
import { ConnectedArgs, WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root',
})
export class SocketClientDataInitializerService {
  constructor(
    private _socketService: WebSocketService,
    private _socketUsersService: SocketUsersService,
    private _chatService: ChatService,
    private _roomPingsService: RoomPingsService
  ) {}

  public initSocketClientData(clientUser: User): Observable<void> {
    return defer((): Observable<void> => {
      const organizationId: number = clientUser.organizationId;
      const messagesBeforeDate = new Date();
      messagesBeforeDate.setHours(messagesBeforeDate.getHours() + 24);

      return concat<void>(
        concat(
          this._socketService.connect(),
          this._socketUsersService.joinClientUser(clientUser)
        ),
        merge(
          this._socketUsersService.loadUsers(organizationId),
          this._chatService.loadMessages(
            organizationId,
            messagesBeforeDate,
            50
          ),
          this._roomPingsService.loadRooms(organizationId),
          this._roomPingsService.getRequestingPings()
        )
      );
    }).pipe(
      catchError((error: any) => {
        switch (typeof error) {
          case 'string':
            return throwError(error);
          case 'object':
            return throwError(error.toString());
          default:
            return throwError('An unknown error occurred');
        }
      }),
      last()
    );
  }

  public monitorReconnection(clientUser: User): Observable<void> {
    return this._socketService.connected$.pipe(
      takeUntil(this._socketService.disposed$),
      filter((value: ConnectedArgs) => value.isReconnection),
      switchMap(() => this.initSocketClientData(clientUser))
    );
  }
}
