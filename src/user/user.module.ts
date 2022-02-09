import { CommonModule } from '@/common/common.module';
import { Module } from '@nestjs/common';
import { UserService } from './application/user.service';
import { UserController } from './interfaces/user.controller';

@Module({
  imports: [CommonModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [],
})
export class UserModule {}
