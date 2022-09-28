import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Includable } from 'src/app/shared/models/includable.type';
import { PagedList } from 'src/app/shared/models/pagination/paged-list';
import { Paged } from 'src/app/shared/models/pagination/paged.type';
import { ChatMessage } from '../../models/messages/chat-message';
import { WebApiService } from './web-api.service';

@Injectable({
  providedIn: 'root',
})
export class ChatMessagesService extends WebApiService {
  private readonly _apiPrefix: string = 'chat-messages';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public getAllMessages(
    model?: Paged<Includable<Partial<ChatMessage>>>
  ): Observable<HttpResponse<PagedList<ChatMessage>>> {
    const url: string = `${this._apiPrefix}${this.getObjectQueryParams(model)}`;
    return this.get(url);
  }

  public getAllMessagesBeforeDate(
    model?: Paged<Includable<Partial<ChatMessage>>>
  ): Observable<HttpResponse<ChatMessage[]>> {
    const url: string = `${this._apiPrefix}/before${this.getObjectQueryParams(
      model
    )}`;
    return this.get(url);
  }

  public getMessage(messageId: number): Observable<HttpResponse<ChatMessage>> {
    return this.get(`${this._apiPrefix}/${messageId}`);
  }

  public addMessage(
    request: ChatMessage
  ): Observable<HttpResponse<ChatMessage>> {
    return this.post(this._apiPrefix, request);
  }

  public updateMessage(
    messageId: number,
    request: ChatMessage
  ): Observable<HttpResponse<ChatMessage>> {
    return this.put(`${this._apiPrefix}/${messageId}`, request);
  }

  public deleteMessage(messageId: number): Observable<HttpResponse<void>> {
    return this.delete(`${this._apiPrefix}/${messageId}`);
  }
}
