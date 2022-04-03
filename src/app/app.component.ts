import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from './core/services/login.service';
import { AccessibilityService } from './shared/modules/accessibility/accessibility.service';
import { EventsService } from './shared/modules/events/events.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(private _eventsService: EventsService, private _accessibilityService: AccessibilityService) { }

  ngOnInit(): void {
    this._eventsService.subscribe({
      eventSources: LoginService.name,
      eventTypes: "login",
      eventHandler: () => this._accessibilityService.loadPreferences()
    });
  }

  ngOnDestroy(): void {
    this._eventsService.unsubscribeAll();
  }
}