import { User } from '@/auth/domain/user.entity';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../application/user.service';

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
