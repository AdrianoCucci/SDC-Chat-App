import { Component, Input } from '@angular/core';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersList {
  @Input() public users: User[];

  public getOnlineUsers(): User[] {
    return this.users?.filter(u => u.isOnline) ?? null;
  }

  public getOfflineUsers(): User[] {
    return this.users?.filter(u => !u.isOnline) ?? null;
  }

  public getUserInitials(user: User): string {
    let initials: string = "";

    const displayName: string = this.getUserDisplayName(user).toUpperCase();
    const split: string[] = displayName.split(' ');

    for(let i = 0; i < split.length; i++) {
      initials += split[i].charAt(0);
    }

    return initials;
  }

  public getUserDisplayName(user: User): string {
    return user.displayName ?? user.username;
  }
}