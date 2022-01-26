import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { LoginRequest } from './dto/login.request';
import { RefreshTokenRequest } from './dto/refresh-token.request';
import { SignUpRequest } from './dto/sign-up.request';
import { TokenResponse } from './dto/token.response';
import { User } from './entities/user.entity';
import { JwtRefreshGuard } from './guard/refresh-token.guard';

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
