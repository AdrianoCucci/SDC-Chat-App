import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { User } from 'src/app/core/models/users/user';
import { UserPrefsService } from 'src/app/core/services/user-prefs.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  @Input() public users: User[];
  @Input() public clientUser: User;

  private readonly _prefsKey: string = 'chatUsersCollapse';
  private _collapsed: boolean = false;

  constructor(private _userPrefsService: UserPrefsService) {}

  ngOnInit(): void {
    this._collapsed =
      this._userPrefsService.getPreference(this._prefsKey) ?? false;
  }

  public getOnlineUsers(): User[] {
    return (
      this.users?.filter((u) => u.isOnline || this.clientUser?.id === u.id) ??
      null
    );
  }

  public getOfflineUsers(): User[] {
    return (
      this.users?.filter(
        (u) => !u.isOnline && (this.clientUser?.id !== u.id ?? true)
      ) ?? null
    );
  }

  public getUserDisplayName(user: User): string {
    return user.displayName ?? user.username;
  }

  public get collapsed(): boolean {
    return this._collapsed;
  }
  @Input() @HostBinding('class.collapsed') public set collapsed(
    value: boolean
  ) {
    if (value != null && this._collapsed !== value) {
      this._collapsed = value;

      this._collapsed
        ? this._userPrefsService
            .setPreference(this._prefsKey, this._collapsed)
            .subscribe()
        : this._userPrefsService.deletePreference(this._prefsKey).subscribe();
    }
  }
}
