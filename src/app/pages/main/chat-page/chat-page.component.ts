import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/core/services/chat.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent implements OnInit {

  constructor(private _chatService: ChatService) { }

  ngOnInit(): void {
   
  }
}