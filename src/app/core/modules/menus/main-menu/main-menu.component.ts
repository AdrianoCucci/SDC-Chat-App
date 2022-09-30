import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoomPing } from 'src/app/core/models/room-pings/room-ping';
import { RoomPingState } from 'src/app/core/models/room-pings/room-ping-state';
import { User } from 'src/app/core/models/users/user';
import { ChatService } from 'src/app/core/services/web-socket/chat.service';
import { RoomPingsService } from 'src/app/core/services/web-socket/room-pings.service';
import { MenuItem } from 'src/app/shared/models/menu-item';
import { EventSubscription } from 'src/app/shared/modules/events/event-subscription.model';
import { EventsService } from 'src/app/shared/modules/events/events.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenu implements OnInit, OnDestroy {
  @Input() public menuItems: MenuItem[];
  @Input() public clientUser: User;

  private _chatItem?: MenuItem;
  private _newMessagesCount: number = 0;
  private _eventSubscription: EventSubscription;

  constructor(
    private _router: Router,
    private _roomPingsService: RoomPingsService,
    private _eventsService: EventsService
  ) {}

  ngOnInit(): void {
    this.initMenuItems(this.menuItems);
    this._eventSubscription = this.subscribeEvents();
  }

  ngOnDestroy(): void {
    this._eventsService.unsubscribe(this._eventSubscription);
    this._eventSubscription = undefined;
  }

  private initMenuItems(menuItems: MenuItem[]) {
    if (menuItems?.length > 0) {
      this._chatItem = menuItems.find((m: MenuItem) => m.id === 'chat');

      if (this._chatItem != null) {
        this._chatItem.onClick = () => (this._newMessagesCount = 0);
      }
    }
  }

  private subscribeEvents(): EventSubscription {
    return this._eventsService.subscribe({
      eventSources: ChatService.name,
      eventTypes: 'message',
      eventHandler: () => {
        if (!this.isChatItemActive) {
          this._newMessagesCount++;
        }
      },
    });
  }

  public getDisplayCount(count: number) {
    return count > 99 ? '99+' : count.toString();
  }

  public get isChatItemActive(): boolean {
    return this._chatItem?.routerLink === this._router.url;
  }

  public get newMessagesCount(): number {
    return this._newMessagesCount;
  }

  public get roomPingRequestsCount(): number {
    let count: number = 0;

    if (this.clientUser != null) {
      const predicate = (r: RoomPing) =>
        r.requestUserId !== this.clientUser.id &&
        r.state === RoomPingState.Requesting;
      count = this._roomPingsService.pings?.filter(predicate).length ?? 0;
    }

    return count;
  }
}
