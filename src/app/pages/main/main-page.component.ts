import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationStart, Router } from '@angular/router';
import { concat, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from 'rxjs/operators';
import { Role } from 'src/app/core/models/auth/role';
import { User } from 'src/app/core/models/users/user';
import { AudioService } from 'src/app/core/services/audio/audio.service';
import { LoginService } from 'src/app/core/services/login.service';
import { SocketClientDataInitializerService } from 'src/app/core/services/web-socket/socket-client-data-initializer.service';
import { MAIN_PATHS } from 'src/app/shared/app-paths';
import { MenuItem } from 'src/app/shared/models/menu-item';
import { MainMenuItemsMapper } from 'src/app/shared/util/main-menu-items-mapper';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPage implements OnInit, OnDestroy {
  public readonly mainMenuItems: MenuItem[];
  public readonly appName: string = environment.app.name;

  private readonly _destroyed$ = new Subject<void>();
  private _initialized: boolean = false;
  private _initError: string;

  constructor(
    private _loginService: LoginService,
    private _router: Router,
    private _socketClientInitService: SocketClientDataInitializerService,
    private _audioService: AudioService
  ) {
    if (this.clientUser != null) {
      this.mainMenuItems = new MainMenuItemsMapper().getMenuItemsByRole(
        this.clientUser.role
      );
    }
  }

  async ngOnInit(): Promise<void> {
    await this.initRouterEvents();

    if (
      this.clientUser.role === Role.Administrator ||
      this.clientUser.organizationId == null
    ) {
      this._initialized = true;
      return;
    }

    concat(
      this._socketClientInitService.initSocketClientData(this.clientUser).pipe(
        finalize(() => (this._initialized = true)),
        catchError((error: string) => (this._initError = error))
      ),
      this._socketClientInitService.monitorReconnection(this.clientUser)
    )
      .pipe(takeUntil(this._destroyed$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this._audioService.stopAllAudio();

    this._destroyed$.next();
    this._destroyed$.complete();
  }

  private async initRouterEvents(): Promise<void> {
    const rootPath: string = `/${MAIN_PATHS.root}`;

    if (this._router.url === rootPath) {
      await this.navigateToFirstMenuItem();
    }

    this._router.events
      .pipe(takeUntil(this._destroyed$))
      .subscribe(async (event: Event) => {
        if (event instanceof NavigationStart && event.url === rootPath) {
          await this.navigateToFirstMenuItem();
        }
      });
  }

  public logout(): void {
    this._loginService.logout();
    this._router.navigateByUrl('');
  }

  private async navigateToFirstMenuItem(): Promise<void> {
    if (this.mainMenuItems?.length > 0) {
      await this._router.navigateByUrl(this.mainMenuItems[0].routerLink, {
        replaceUrl: true,
      });
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
    return (
      this._loginService.user?.displayName || this._loginService.user?.username
    );
  }

  public get accountPageRouterLink(): string {
    return MAIN_PATHS.children.account.root;
  }
}
