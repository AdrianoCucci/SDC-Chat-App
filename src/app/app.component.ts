import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginService } from './core/services/login.service';
import { AccessibilityService } from './shared/modules/accessibility/accessibility.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private _subscription: Subscription;

  constructor(private _loginService: LoginService, private _accessibilityService: AccessibilityService) { }

  ngOnInit(): void {
    this._subscription = this._loginService.onLogin.subscribe(() => this._accessibilityService.loadPreferences());
  }

  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
    this._subscription = null;
  }
}