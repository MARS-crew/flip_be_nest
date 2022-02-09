import { ApiResponse } from '@/common/response/api.response';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { JwtRefreshGuard } from '../../common/guards/refresh-token.guard';
import { AuthService } from '../application/auth.service';
import { User } from '../domain/user.entity';
import { LoginRequest } from './login.request';
import { RefreshTokenRequest } from './refresh-token.request';
import { SignUpRequest } from './sign-up.request';
import { TokenResponse } from './token.response';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Body(ValidationPipe) signUpRequest: SignUpRequest,
  ): Promise<ApiResponse<TokenResponse>> {
    const response = await this.authService.signUp(signUpRequest);
    return ApiResponse.of({
      data: response,
      message: 'success signup',
      statusCode: HttpStatus.CREATED,
    });
  }

  @Post('/login')
  async login(
    @Body(ValidationPipe) loginRequest: LoginRequest,
  ): Promise<ApiResponse<TokenResponse>> {
    const response = await this.authService.login(loginRequest);
    return ApiResponse.of({
      data: response,
      message: 'success login',
    });
  }

  @UseGuards(JwtRefreshGuard)
  @Post('/token/refresh')
  async refreshToken(
    @GetUser() user: User,
    @Body() refreshTokenRequest: RefreshTokenRequest,
  ): Promise<ApiResponse<TokenResponse>> {
    const response = await this.authService.refreshToken(
      user,
      refreshTokenRequest,
    );
    return ApiResponse.of({
      data: response,
      message: 'succes refresh token',
    });
  }

  @UseGuards(AuthGuard())
  @Post('/logout')
  async logout(@GetUser() user: User): Promise<ApiResponse<void>> {
    await this.authService.logout(user);
    return ApiResponse.of({
      message: 'success logout',
    });
  }
}
