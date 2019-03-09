import {ApplicationRef, Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from './user.model';
import {skipWhile} from 'rxjs/operators';
import {SocketIO, SocketIOSocket} from '../../socket-io/socket-io.module';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly usersEmitter$ = new BehaviorSubject<User[]>([]);
  private readonly currentUserEmitter$ = new BehaviorSubject<User>(undefined);

  constructor(@Inject(SocketIO) private socketIO: SocketIOSocket,
              private applicationRef: ApplicationRef,
              private cookieService: CookieService) {
    this.setupEventListeners();
  }

  public get currentUser$(): Observable<User> {
    return this.currentUserEmitter$.pipe(
      skipWhile(user => user === undefined)
    );
  }

  public get currentUser(): User {
    return this.currentUserEmitter$.value;
  }

  public get users$(): Observable<User[]> {
    return this.usersEmitter$.asObservable();
  }

  private setupEventListeners() {
    this.socketIO.on('setUser', user => {
      this.cookieService.set('user', JSON.stringify(user));

      this.currentUserEmitter$.next(user);
      this.applicationRef.tick();
    });

    this.socketIO.on('listUsers', users => {
      this.usersEmitter$.next(users);
      this.applicationRef.tick();
    });

    this.socketIO.on('newUser', user => {
      if (this.currentUserEmitter$.value !== undefined && user.name !== this.currentUserEmitter$.value.name) {
        this.usersEmitter$.next(this.usersEmitter$.value.concat(user));
        this.applicationRef.tick();
      }
    });

    this.socketIO.on('removeUser', user => {
      this.usersEmitter$.next(
        this.usersEmitter$.value.filter(u => u.name !== user.name)
      );
      this.applicationRef.tick();
    });

    this.socketIO.on('updateUser', (changeInfo: {target: string, updatedUser: User}) => {
      const renamedUsers = this.usersEmitter$.value.map(user =>
        (user.name === changeInfo.target)
          ? changeInfo.updatedUser
          : user
      );

      this.usersEmitter$.next(renamedUsers);

      if (this.currentUser && changeInfo.target === this.currentUser.name) {
        this.cookieService.set('user', JSON.stringify(changeInfo.updatedUser));
        this.currentUserEmitter$.next(changeInfo.updatedUser);
      }

      this.applicationRef.tick();
    });

    this.socketIO.on('disconnect', () => {
      this.usersEmitter$.next([]);
      this.currentUserEmitter$.next(undefined);

      this.applicationRef.tick();
    });
  }
}
