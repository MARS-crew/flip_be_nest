import {
  BadRequestException,
  Body,
  Controller,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest } from './dto/login.request';
import { SignUpRequest } from './dto/sign-up.request';
import { TokenResponse } from './dto/token.response';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) signUpRequest: SignUpRequest,
  ): Promise<TokenResponse> {
    if (!signUpRequest.validate)
      throw new BadRequestException(
        'password and passwordCheck are not the same.',
      );
    return this.authService.signUp(signUpRequest);
  }

  @Post('/login')
  async login(
    @Body(ValidationPipe) loginRequest: LoginRequest,
  ): Promise<TokenResponse> {
    return this.authService.login(loginRequest);
  }
}
