import { CommonModule } from '@/common/common.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './application/auth.service';
import { UserRepository } from './infrastructure/user.repository';
import { AuthController } from './interfaces/auth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), CommonModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
