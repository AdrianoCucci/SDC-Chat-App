import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Role } from 'src/app/core/models/auth/role';
import { User } from 'src/app/core/models/users/user';
import { AudioService } from 'src/app/core/services/audio/audio.service';
import { LoginService } from 'src/app/core/services/login.service';
import { ChatService } from 'src/app/core/services/web-socket/chat.service';
import { RoomPingsService } from 'src/app/core/services/web-socket/room-pings.service';
import { SocketUsersService } from 'src/app/core/services/web-socket/socket-users.service';
import { WebSocketService } from 'src/app/core/services/web-socket/web-socket.service';
import { MAIN_PATHS } from 'src/app/shared/app-paths';
import { MenuItem } from 'src/app/shared/models/menu-item';
import { MainMenuItemsMapper } from 'src/app/shared/util/main-menu-items-mapper';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPage implements OnInit, OnDestroy {
  public readonly mainMenuItems: MenuItem[];
  public readonly appName: string = environment.app.name;

  private _subscription: Subscription;
  private _initialized: boolean = false;
  private _initError: string;

  constructor(
    private _loginService: LoginService,
    private _router: Router,
    private _socketService: WebSocketService,
    private _socketUsersService: SocketUsersService,
    private _chatService: ChatService,
    private _roomPingsService: RoomPingsService,
    private _audioService: AudioService
  ) {
    if(this.clientUser != null) {
      this.mainMenuItems = new MainMenuItemsMapper().getMenuItemsByRole(this.clientUser.role);
    }
  }

  async ngOnInit(): Promise<void> {
    this._subscription = new Subscription();

    await this.initRouterEvents(this._subscription);

    if(this.clientUser.role !== Role.Administrator && this.clientUser.organizationId != null) {
      try {
        await this.initSocketClientData(this.clientUser);
      }
      catch(error) {
        switch(typeof error) {
          case "string":
            this._initError = error;
            break;
          case "object":
            this._initError = error.toString();
            break;
          default:
            this._initError = "An unknown error occurred";
            break;
        }
      }
    }

    this._initialized = true;
  }

  ngOnDestroy(): void {
    this._audioService.stopAllAudio();

    this._subscription.unsubscribe();
    this._subscription = null;
  }

  private async initRouterEvents(subscription: Subscription): Promise<void> {
    const rootPath: string = `/${MAIN_PATHS.root}`;

    if(this._router.url === rootPath) {
      await this.navigateToFirstMenuItem();
    }

    subscription.add(this._router.events.subscribe(async (event: Event) => {
      if(event instanceof NavigationStart && event.url === rootPath) {
        await this.navigateToFirstMenuItem();
      }
    }));
  }

  private async initSocketClientData(clientUser: User): Promise<void> {
    await this._socketService.connect();
    this._socketUsersService.joinClientUser(clientUser);

    const organizationId: number = clientUser.organizationId;

    const messagesBeforeDate = new Date();
    messagesBeforeDate.setHours(messagesBeforeDate.getHours() + 24);

    await Promise.all([
      this._socketUsersService.loadUsers(organizationId),
      this._chatService.loadMessages(organizationId, messagesBeforeDate, 50),
      this._roomPingsService.loadRooms(organizationId),
      this._roomPingsService.getRequestingPings()
    ]);
  }

  public logout(): void {
    this._loginService.logout();
    this._router.navigateByUrl("");
  }

  private async navigateToFirstMenuItem(): Promise<void> {
    if(this.mainMenuItems?.length > 0) {
      await this._router.navigateByUrl(this.mainMenuItems[0].routerLink, { replaceUrl: true });
    }
  }

  public get initialized(): boolean {
    return this._initialized;
  }

  public get initError(): string {
    return this._initError;
  }

  public get clientUser(): User {
    return this._loginService.user;
  }

  public get userDisplayName(): string {
    return this._loginService.user?.displayName || this._loginService.user?.username;
  }

  public get accountPageRouterLink(): string {
    return MAIN_PATHS.children.account;
  }
}