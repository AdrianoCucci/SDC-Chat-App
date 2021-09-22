import { Component, Input } from '@angular/core';
import { User } from 'src/app/core/models/users/user';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent {
  @Input() public users: User[];

  public getOnlineUsers(): User[] {
    return this.users?.filter(u => u.isOnline) ?? null;
  }

  public getOfflineUsers(): User[] {
    return this.users?.filter(u => !u.isOnline) ?? null;
  }

  public getUserDisplayName(user: User): string {
    return user.displayName ?? user.username;
  }
}