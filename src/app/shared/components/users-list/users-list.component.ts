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
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.trim().toUpperCase();
  }

  public getUserFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`.trim();
  }
}