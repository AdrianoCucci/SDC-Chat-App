import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { SocketIoModule } from "ngx-socket-io";
import { environment } from "src/environments/environment";

import { WebSocketService } from "./web-socket.service";
import { ChatService } from "./chat.service";

@NgModule({
  imports: [
    CommonModule,
    SocketIoModule.forRoot({ url: environment.server.url, options: { autoConnect: false } })
  ],
  providers: [
    WebSocketService,
    ChatService
  ]
})
export class WebSocketModule { }