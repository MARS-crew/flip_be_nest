import * as config from 'config';

export class TokenResponse {
  constructor(payload: { accessToken: string }) {
    this.accessToken = payload.accessToken;
  }
  accessToken: string;
  expiresIn: number = config.get('jwt.expiresIn');
  // refreshToken
}
