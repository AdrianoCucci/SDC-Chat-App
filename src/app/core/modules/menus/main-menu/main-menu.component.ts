import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RoomPing } from 'src/app/core/models/room-pings/room-ping';
import { User } from 'src/app/core/models/users/user';
import { WebSocketService } from 'src/app/core/services/web-socket/web-socket.service';
import { MenuItem } from 'src/app/shared/models/menu-item';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenu implements OnInit, OnDestroy {
  @Input() public menuItems: MenuItem[];
  @Input() public clientUser: User;

  private _subscription: Subscription;
  private _chatItem?: MenuItem;
  private _newMessagesCount: number = 0;

  constructor(private _router: Router, private _socketService: WebSocketService) { }

  ngOnInit(): void {
    this.initMenuItems(this.menuItems);

    this._subscription = new Subscription();
    this.subscribeEvents(this._subscription);
  }

  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
    this._subscription = null;
  }

  private initMenuItems(menuItems: MenuItem[]) {
    if(menuItems?.length > 0) {
      this._chatItem = menuItems.find((m: MenuItem) => m.id === "chat");

      if(this._chatItem != null) {
        this._chatItem.onClick = () => this._newMessagesCount = 0;
      }
    }
  }

  private subscribeEvents(subscription: Subscription) {
    subscription.add(this._socketService.chat.onMessage.subscribe(() => {
      if(!this.isChatItemActive) {
        this._newMessagesCount++;
      }
    }));
  }

  public get isChatItemActive(): boolean {
    return this._chatItem?.routerLink === this._router.url;
  }

  public get newMessagesCount(): number {
    return this._newMessagesCount;
  }

  public get roomPingRequestsCount(): number {
    let count: number = 0;

    if(this.clientUser != null) {
      count = this._socketService.roomPings.requestingPings?.filter((r: RoomPing) => r.requestUserId !== this.clientUser.id).length ?? 0;
    }

    return count;
  }
}