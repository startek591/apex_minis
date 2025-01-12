import { LoginTypes as Api } from '@capstone/mock-api';
import * as _decode from 'jwt-decode';
import { isNil } from 'lodash';

const decode = _decode;

interface Token {
  sub: string;
  DisplayName?: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string[];
}

const adminRole = 'COD Administrator';

export class Authentication {
  private constructor(
    public readonly token: string,
    public readonly username: string,
    public readonly isAdmin: boolean,
    public readonly roles: string[] | undefined,
    public readonly fullName?: string
  ) {}

  static createFromApi({
    access_token: token,
  }: Api.Authentication): Authentication {
    if (!token) {
      throw new Error('Authentication response is missing the access token.');
    }
    return Authentication.createFromToken(token);
  }

  static createFromToken(token: string): Authentication {
    const {
      DisplayName: fullName,
      sub: username,
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': roles,
    } = decode<Token>(token);

    const isAdmin = !isNil(roles) && roles?.some((role) => role === adminRole);
    return new Authentication(token, username, isAdmin, roles, fullName);
  }
}
