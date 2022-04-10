import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class SwNotificationsService {
  private _notifications: Notification[];

  public requestPermission(): Promise<NotificationPermission> {
    return Notification.requestPermission();
  }

  public showNotification(title: string, options?: NotificationOptions): Notification {
    if(!this.hasPermission) {
      throw new Error("Notifications permission has not been granted.");
    }

    const notification = new Notification(title, { timestamp: new Date().getTime(), ...options });
    this.addNotification(notification);

    return notification;
  }

  public closeAllNotifications(): void {
    this._notifications.forEach((n: Notification) => n.close());
  }

  private addNotification(notification: Notification): void {
    this._notifications ? this._notifications.push(notification) : this._notifications = [notification];
    notification.onclose = () => this.removeNotification(notification);
  }

  private removeNotification(notification: Notification): void {
    const notifications: Notification[] = this._notifications;
    const index: number = notifications.indexOf(notification);

    if(index !== -1) {
      notifications.splice(index, 1);
    }
  }

  public get permission(): NotificationPermission {
    return Notification.permission;
  }

  public get hasPermission(): boolean {
    return this.permission === "granted";
  }
}