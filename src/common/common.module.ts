import { UserRepository } from '@/auth/infrastructure/user.repository';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as config from 'config';
import { JwtConfig } from './config/jwt-config';
import { JwtRefreshStrategy } from './config/jwt-refresh.strategy';
import { JwtStrategy } from './config/jwt.strategy';
import { TokenProvider } from './utils/token-provider';

const jwtConfig: JwtConfig = {
  secret: config.get('jwt.secret'),
  refreshSecret: config.get('jwt.refreshSecret'),
  expiresIn: config.get('jwt.expiresIn'),
  refreshExpiresIn: config.get('jwt.refreshExpiresIn'),
};
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: config.get('jwt.secret'),
      signOptions: {
        expiresIn: config.get('jwt.expiresIn'),
      },
    }),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  providers: [
    JwtStrategy,
    JwtRefreshStrategy,
    TokenProvider,
    { provide: JwtConfig, useValue: jwtConfig },
  ],
  exports: [PassportModule, TypeOrmModule, JwtModule, TokenProvider],
})
export class CommonModule {}
