import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NotificationPrefs } from 'src/app/core/models/user-prefs/notification-prefs.model';
import { EventNotificationsService } from 'src/app/core/services/notifications/event-notifications-service';
import { SwNotificationsService } from 'src/app/core/services/notifications/sw-notifications.service';
import { UserPrefsService } from 'src/app/core/services/user-prefs.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss']
})
export class NotificationsPage implements OnInit {
  public prefs: NotificationPrefs = {};

  private readonly _notificationsPrefsKey: string = "notifications";
  private _isSaving: boolean;

  constructor(
    private _userPrefsService: UserPrefsService,
    private _notifsService: SwNotificationsService,
    private _eventNotifsService: EventNotificationsService,
    private _changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadNotificationPrefs();
  }

  private loadNotificationPrefs(): void {
    const prefs: NotificationPrefs = this._userPrefsService.getPreference(this._notificationsPrefsKey);
    this.prefs = prefs ?? this.prefs;
  }

  async onSave(): Promise<void> {
    try {
      this._isSaving = true;
      await this._userPrefsService.setPreference(this._notificationsPrefsKey, this.prefs);
      this._eventNotifsService.registerEvents();
    }
    finally {
      this._isSaving = false;
    }
  }

  async onRequestPermission(): Promise<void> {
    await this._notifsService.requestPermission();
    this._changeDetector.detectChanges();
  }

  public get isSaving(): boolean {
    return this._isSaving;
  }

  public get hasNotificationsPermission(): boolean {
    return this._notifsService.hasPermission;
  }
}