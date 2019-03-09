import {ApplicationRef, Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Message} from './message.model';
import {SocketIO, SocketIOSocket} from '../../socket-io/socket-io.module';
import {UserService} from '../user-service/user.service';
import {User} from '../user-service/user.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private readonly messagesEmitter = new BehaviorSubject<Message[]>([]);

  constructor(@Inject(SocketIO) private socketIO: SocketIOSocket,
              private userService: UserService,
              private applicationRef: ApplicationRef) {
    this.setupEventListeners();
  }

  public get messages(): Observable<Message[]> {
    return this.messagesEmitter.asObservable();
  }

  public get isConnected(): boolean {
    return this.socketIO.connected;
  }

  public sendMessage(message: string) {
    this.socketIO.emit('sendMessage', message);
  }

  private setupEventListeners() {
    const messageHandler = message => {
      message.timestamp = message.timestamp && new Date(message.timestamp);
      message.isFromCurrentUser =
        this.userService.currentUser !== undefined &&
        message.user &&
        message.user.name === this.userService.currentUser.name;

      this.messagesEmitter.next(
        this.messagesEmitter.value.concat(message)
      );
    };

    this.socketIO.on('newMessage', message => {
      messageHandler(message);
      this.applicationRef.tick();
    });

    this.socketIO.on('listMessages', messages => {
      this.messagesEmitter.next([]);

      messages.forEach(message => {
        messageHandler(message);
      });

      this.applicationRef.tick();
    });

    this.socketIO.on('updateUser', (changeInfo: {target: string, updatedUser: User}) => {
      const renamedMessages = this.messagesEmitter.value.map(message =>
        (message.user.name === changeInfo.target)
          ? Object.assign({}, message, {user: changeInfo.updatedUser})
          : message
      );

      this.messagesEmitter.next(renamedMessages);
      this.applicationRef.tick();
    });

    this.socketIO.on('disconnect', () => {
      this.applicationRef.tick();
    });
  }
}
