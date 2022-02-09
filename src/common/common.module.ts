import { UserRepository } from '@/auth/infrastructure/user.repository';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as config from 'config';
import { JwtRefreshStrategy } from './config/jwt-refresh.strategy';
import { JwtStrategy } from './config/jwt.strategy';

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
  providers: [JwtStrategy, JwtRefreshStrategy],
  exports: [PassportModule, TypeOrmModule, JwtModule],
})
export class CommonModule {}
