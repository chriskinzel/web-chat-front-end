import {ApplicationRef, Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Message} from './message.model';
import {SocketIO, SocketIOSocket} from '../../socket-io/socket-io.module';
import {UserService} from '../user-service/user.service';

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
      message.timestamp = new Date(message.timestamp);
      message.isFromCurrentUser = this.userService.currentUser !== undefined &&
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

    this.socketIO.on('disconnect', () => {
      this.applicationRef.tick();
    });
  }
}
