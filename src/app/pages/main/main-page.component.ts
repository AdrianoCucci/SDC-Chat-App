import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { LoginService } from 'src/app/core/services/login.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPage implements OnInit, OnDestroy {
  public readonly appName: string = environment.app.name;
  public readonly appVersion: string = environment.app.version;
  public readonly userDisplayName: string;

  public logoutDialogVisible: boolean = false;
  
  constructor(private _loginService: LoginService, private _router: Router, private _socket: Socket) { 
    this.userDisplayName = _loginService.user.displayName || _loginService.user.username;
  }

  ngOnInit() {
    this._socket.connect();
  }

  ngOnDestroy() {
    this._socket.disconnect();
  }

  public logout(): void {
    this._loginService.logout();
    this._router.navigateByUrl("");
  }
}
