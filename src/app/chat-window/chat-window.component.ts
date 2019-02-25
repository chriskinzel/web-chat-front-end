import { Component } from '@angular/core';
import {MessageService} from '../shared/services/message-service/message.service';

@Component({
  selector: 'chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent {

  constructor(public messageService: MessageService) {}
}
