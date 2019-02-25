import {Component, Input} from '@angular/core';
import {Message} from '../../shared/services/message-service/message.model';

@Component({
  selector: 'messages-window',
  templateUrl: './messages-window.component.html',
  styleUrls: ['./messages-window.component.css']
})
export class MessagesWindowComponent {
  @Input() messages: Message[] = [];

  public trackMessagesBy(index: number, message: Message) {
    return index;
  }
}
