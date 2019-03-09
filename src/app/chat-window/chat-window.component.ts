import {Component} from '@angular/core';
import {MessageService} from '../shared/services/message-service/message.service';
import {UserService} from '../shared/services/user-service/user.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent {
  public readonly userColorStyle$ = this.userService.currentUser$.pipe(
    map(currentUser => `--user-color: ${currentUser.color}`)
  );

  constructor(public messageService: MessageService,
              public userService: UserService) {}
}
