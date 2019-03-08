import {Component, Input} from '@angular/core';
import {User} from '../../shared/services/user-service/user.model';

@Component({
  selector: 'users-panel',
  templateUrl: './users-panel.component.html',
  styleUrls: ['./users-panel.component.css']
})
export class UsersPanelComponent {
  @Input() users: User[] = [];
  @Input() currentUser: User;

  public trackUsersBy(index: number, user: User) {
    return user.name;
  }
}
