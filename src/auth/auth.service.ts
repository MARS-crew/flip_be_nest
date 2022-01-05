import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpRequest } from './dto/sign-up.request';
import { TokenResponse } from './dto/token.response';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpRequest: SignUpRequest): Promise<TokenResponse> {
    const newUser: User = await this.userRepository.signUp(signUpRequest);

    const accessToken = this.jwtService.sign({ email: newUser.email });

    return new TokenResponse(accessToken);
  }
}
