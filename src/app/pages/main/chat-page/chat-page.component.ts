import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { User } from 'src/app/core/models/user';
import { UsersService } from 'src/app/core/services/api/users-service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent {
  public users: User[];

  constructor(private _usersService: UsersService) { }

  ngOnInit() {
    this.loadUsers();
  }

  private async loadUsers(): Promise<void> {
    try {
      const response: HttpResponse<User[]> = await this._usersService.getAllUsers().toPromise();
      this.users = response.body;
    }
    catch(error) {
      throw error;
    }
  }
}