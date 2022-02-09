import {
  Body,
  Controller,
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
  async signUp(
    @Body(ValidationPipe) signUpRequest: SignUpRequest,
  ): Promise<TokenResponse> {
    return this.authService.signUp(signUpRequest);
  }

  @Post('/login')
  async login(
    @Body(ValidationPipe) loginRequest: LoginRequest,
  ): Promise<TokenResponse> {
    return this.authService.login(loginRequest);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('/token/refresh')
  async refreshToken(
    @GetUser() user: User,
    @Body() refreshTokenRequest: RefreshTokenRequest,
  ) {
    return this.authService.refreshToken(user, refreshTokenRequest);
  }

  @UseGuards(AuthGuard())
  @Post('/logout')
  async logout(@GetUser() user: User): Promise<void> {
    return this.authService.logout(user);
  }
}
