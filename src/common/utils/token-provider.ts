import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtConfig } from '../config/jwt-config';

@Injectable()
export class TokenProvider {
  constructor(private readonly jwtConfig: JwtConfig) {}

  async generateAccessToken(email: string): Promise<string> {
    return jwt.sign({ email }, this.jwtConfig.secret, {
      expiresIn: this.jwtConfig.expiresIn,
    });
  }

  async generateRefreshToken(email: string): Promise<string> {
    return jwt.sign({ email }, this.jwtConfig.refreshSecret, {
      expiresIn: this.jwtConfig.refreshExpiresIn,
    });
  }
}
