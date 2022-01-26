import * as config from 'config';

export class TokenResponse {
  readonly accessToken: string;
  readonly expiresIn: number = config.get('jwt.expiresIn');
  readonly refreshToken: string;
  readonly refreshExpiresIn: number = config.get('jwt.refreshExpiresIn');

  constructor(payload: { accessToken: string; refreshToken: string }) {
    this.accessToken = payload.accessToken;
    this.refreshToken = payload.refreshToken;
  }
}
