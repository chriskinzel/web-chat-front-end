import {Component, Input} from '@angular/core';
import {Message} from '../../../shared/services/message-service/message.model';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent {
  @Input() message: Message;

  get dateFormat(): string {
    const currentDate = new Date();
    if (currentDate.getDate() !== this.message.timestamp.getDate()) {
      return 'MMM d | h:m aa';
    } else {
      return 'shortTime';
    }
  }
}
