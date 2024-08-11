import { AuthToken } from '@amirsavand/ngx-common';
import { User } from '@interfaces/user';

export interface CustomAuthToken extends AuthToken {
  user: User;
}
