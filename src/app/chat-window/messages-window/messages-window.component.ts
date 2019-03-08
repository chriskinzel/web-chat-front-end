import {Component, Input} from '@angular/core';
import {Message} from '../../shared/services/message-service/message.model';
import {User} from '../../shared/services/user-service/user.model';

@Component({
  selector: 'messages-window',
  templateUrl: './messages-window.component.html',
  styleUrls: ['./messages-window.component.css']
})
export class MessagesWindowComponent {
  @Input() currentUser: User;
  @Input() messages: Message[] = [];
  @Input() hasConnection = false;

  public trackMessagesBy(index: number, message: Message) {
    return index;
  }
}
