import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginService } from './core/services/login.service';
import { AccessibilityService } from './shared/modules/accessibility/accessibility.service';
import { Event } from './shared/modules/events/event.model';
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

    if(environment.app.logEvents) {
      this._eventsService.subscribeAll((event: Event) => console.log(event));
    }
  }

  ngOnDestroy(): void {
    this._eventsService.unsubscribeAll();
  }
}