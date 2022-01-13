import * as config from 'config';

export class TokenResponse {
  accessToken: string;
  expiresIn: number = config.get('jwt.expiresIn');
  // refreshToken

  constructor(payload: { accessToken: string }) {
    this.accessToken = payload.accessToken;
  }
}
