import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
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

  private _navSubscription: Subscription;

  constructor(private _loginService: LoginService, private _router: Router, private _socketService: WebSocketService) {
    const user: User = _loginService.user;

    if(user != null) {
      this.mainMenuItems = new MainMenuItemsMapper().getMenuItemsByRole(user.role);
      this.userDisplayName = user.displayName || user.username;
    }
  }

  async ngOnInit(): Promise<void> {
    const rootPath: string = `/${MAIN_PATHS.root}`;

    if(this._router.url === rootPath) {
      await this.navigateToFirstMenuItem();
    }

    this._navSubscription = this._router.events.subscribe(async (event: Event) => {
      if(event instanceof NavigationStart && event.url === rootPath) {
        await this.navigateToFirstMenuItem();
      }
    });
  }

  ngOnDestroy(): void {
    this._socketService.disconnect();

    this._navSubscription.unsubscribe();
    this._navSubscription = null;
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
}
