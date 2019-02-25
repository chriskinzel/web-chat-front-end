import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {Observable, ReplaySubject} from 'rxjs';
import {Message} from './message.model';
import {asArray} from '../../custom-rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private readonly socketIO = io();
  private readonly messageEmitter = new ReplaySubject<Message>();

  constructor() {
    this.socketIO.on('message', message => {
      this.messageEmitter.next(message);
    });
  }

  public get messages(): Observable<Message[]> {
    return this.messageEmitter.pipe(asArray());
  }

  public get isConnected(): boolean {
    return this.socketIO.connected;
  }

  public sendMessage(message: string) {
    this.socketIO.emit('message', message);
  }
}
