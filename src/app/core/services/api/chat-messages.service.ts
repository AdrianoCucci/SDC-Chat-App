import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ChatMessage } from "../../models/messages/chat-message";
import { ChatMessageQuery } from "../../models/messages/chat-message-query";
import { WebApiService } from "./web-api.service";

@Injectable({
  providedIn: 'root'
})
export class ChatMessagesService extends WebApiService {
  private readonly _apiPrefix: string = "chat-messages";

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public getAllMessages(model?: ChatMessageQuery): Observable<HttpResponse<ChatMessage[]>> {
    const url: string = `${this._apiPrefix}${this.getObjectQueryParams(model)}`;
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