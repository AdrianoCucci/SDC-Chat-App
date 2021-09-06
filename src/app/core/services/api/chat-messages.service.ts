import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ChatMessage } from "../../models/messages/chat-message";
import { WebApiService } from "./web-api.service";

@Injectable({
  providedIn: 'root'
})
export class ChatMessagesService extends WebApiService {
  private readonly _apiPrefix: string = "chat-messages";

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public getAllMessages(): Observable<HttpResponse<ChatMessage[]>> {
    return this.get(this._apiPrefix);
  }
}