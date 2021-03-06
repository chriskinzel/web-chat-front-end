import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { MessagesWindowComponent } from './chat-window/messages-window/messages-window.component';
import { UsersPanelComponent } from './chat-window/users-panel/users-panel.component';
import { MessageComponent } from './chat-window/messages-window/message/message.component';
import { ChatInputComponent } from './chat-window/chat-input/chat-input.component';
import {SocketIOModule} from './shared/socket-io/socket-io.module';
import {environment} from '../environments/environment';
import {CookieService} from 'ngx-cookie-service';
import { TrustHtmlPipe } from './shared/pipes/trust-html/trust-html.pipe';
import { TrustCssPipe } from './shared/pipes/trust-css/trust-css.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ChatWindowComponent,
    MessagesWindowComponent,
    UsersPanelComponent,
    MessageComponent,
    ChatInputComponent,
    TrustHtmlPipe,
    TrustCssPipe
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    SocketIOModule.usingURI(environment.socketIOURL)
  ],
  providers: [
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
