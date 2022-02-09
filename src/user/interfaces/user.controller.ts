import { User } from '@/auth/domain/user.entity';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { ApiResponse } from '@/common/response/api.response';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../application/user.service';
import { UserInfoResponse } from './user-info.response';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard())
  @Get('/me')
  async me(@GetUser() user: User): Promise<ApiResponse<UserInfoResponse>> {
    const response: UserInfoResponse = await this.userService.me(user);
    return ApiResponse.of({
      data: response,
      message: 'success get my userInfo',
    });
  }
}
