import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Role } from 'src/app/core/models/auth/role';
import { User } from 'src/app/core/models/users/user';
import { LoginService } from 'src/app/core/services/login.service';
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
  public readonly appVersion: string = environment.app.version;
  public readonly userDisplayName: string;

  public logoutDialogVisible: boolean = false;

  private readonly _clientUser: User;
  private _subscription: Subscription;
  private _initialized: boolean = false;

  constructor(private _loginService: LoginService, private _router: Router, private _socketService: WebSocketService) {
    const user: User = _loginService.user;

    if(user != null) {
      this.mainMenuItems = new MainMenuItemsMapper().getMenuItemsByRole(user.role);
      this.userDisplayName = user.displayName || user.username;
    }

    this._clientUser = user;
  }

  async ngOnInit(): Promise<void> {
    this._subscription = new Subscription();

    await this.initRouterEvents(this._subscription);

    if(this._clientUser.role !== Role.Administrator && this._clientUser.organizationId != null) {
      try {
        await this.initSocketClientData(this._clientUser);
      }
      catch(error) {
        console.error(error);
      }
    }

    this._initialized = true;
  }

  ngOnDestroy(): void {
    this._socketService.disconnect();

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
    this._socketService.connect(clientUser);

    const organizationId: number = clientUser.organizationId;

    await Promise.all([
      this._socketService.loadUsers(organizationId),
      this._socketService.chat.loadMessages(organizationId),
      this._socketService.roomPings.loadRooms(organizationId),
      this._socketService.roomPings.getRequestingPings()
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
}