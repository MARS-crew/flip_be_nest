import { GetUser } from '@/auth/decorators/get-user.decorator';
import { User } from '@/auth/entities/user.entity';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard())
  @Get('/me')
  async me(@GetUser() user: User) {
    const response = await this.userService.me(user);
    return response;
  }
}
