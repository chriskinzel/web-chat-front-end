import {InjectionToken, ModuleWithProviders, NgModule} from '@angular/core';
import * as socketio from 'socket.io-client';

export const SocketIO = new InjectionToken<SocketIOClient.Socket>('SocketIO');
export type SocketIOSocket = SocketIOClient.Socket;

@NgModule()
export class SocketIOModule {
  public static usingURI(uri: string): ModuleWithProviders {
    return {
      ngModule: SocketIOModule,
      providers: [{provide: SocketIO, useValue: socketio(uri)}]
    };
  }
}
