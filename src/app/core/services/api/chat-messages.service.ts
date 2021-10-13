import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ChatMessage } from "../../models/messages/chat-message";
import { ChatMessageParams } from "../../models/messages/chat-message-params";
import { WebApiService } from "./web-api.service";

@Injectable({
  providedIn: 'root'
})
export class ChatMessagesService extends WebApiService {
  private readonly _apiPrefix: string = "chat-messages";

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public getAllMessages(params?: ChatMessageParams): Observable<HttpResponse<ChatMessage[]>> {
    const query: string = this.buildOptionsQuery(params);
    const url: string = `${this._apiPrefix}${query}`;

    return this.get(url);
  }

  public getMessage(messageId: number): Observable<HttpResponse<ChatMessage>> {
    return this.get(`${this._apiPrefix}/${messageId}`);
  }

  public addMessage(request: ChatMessage): Observable<HttpResponse<ChatMessage>> {
    return this.post(this._apiPrefix, request);
  }

  public updateMessage(messageId: number, request: ChatMessage): Observable<HttpResponse<ChatMessage>> {
    return this.put(`${this._apiPrefix}/${messageId}`, request);
  }

  public deleteMessage(messageId: number): Observable<HttpResponse<void>> {
    return this.delete(`${this._apiPrefix}/${messageId}`);
  }
}