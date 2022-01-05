import * as config from 'config';

export class TokenResponse {
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
  accessToken: string;
  expiresIn: number = config.get('jwt.expiresIn');
  // refreshToken
}
