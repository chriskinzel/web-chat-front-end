import {InjectionToken, ModuleWithProviders, NgModule} from '@angular/core';
import * as socketio from 'socket.io-client';

export type SocketIOSocket = SocketIOClient.Socket;

export const SOCKET_IO_URI = new InjectionToken<string>('__SOCKET_IO_URI__');
export const SocketIO = new InjectionToken<SocketIOSocket>('SocketIO');

export function SocketIOFactory(uri: string) {
  return socketio(uri);
}

@NgModule()
export class SocketIOModule {
  public static usingURI(uri: string): ModuleWithProviders {
    return {
      ngModule: SocketIOModule,
      providers: [
        {provide: SOCKET_IO_URI, useValue: uri},
        {
          provide: SocketIO,
          useFactory: SocketIOFactory,
          deps: [SOCKET_IO_URI]
        }
      ]
    };
  }
}
