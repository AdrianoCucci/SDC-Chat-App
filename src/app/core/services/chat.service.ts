import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

@Injectable()
export class ChatService extends Socket {
  constructor() {
    super({ url: environment.server.url });
  }

  public sendMessage(message: string): void {
    this.emit("message", message);
  }
}
