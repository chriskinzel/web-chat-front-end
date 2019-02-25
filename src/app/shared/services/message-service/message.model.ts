import {User} from '../user-service/user.model';

export interface Message {
  readonly content: string;
  readonly user: User | undefined;
  readonly timestamp: Date | undefined;
}
