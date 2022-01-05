import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpRequest } from './dto/sign-up.request';
import { TokenResponse } from './dto/token.response';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) signUpRequest: SignUpRequest,
  ): Promise<TokenResponse> {
    return this.authService.signUp(signUpRequest);
  }
}
