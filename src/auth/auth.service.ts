import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as config from 'config';
import { LoginRequest } from './dto/login.request';
import { RefreshTokenRequest } from './dto/refresh-token.request';
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

    const tokenResponse: TokenResponse = await this.generateUserToken(
      newUser.email,
    );

    await this.updateUserRefreshToken(newUser, tokenResponse.refreshToken);

    return tokenResponse;
  }

  async login(loginRequest: LoginRequest): Promise<TokenResponse> {
    const { email, password } = loginRequest;
    const findUser: User = await this.userRepository.findOne({ email });

    if (!findUser) {
      throw new NotFoundException(`Can't find user with email : ${email}`);
    }

    await findUser.validatePassword(password);

    const tokenResponse: TokenResponse = await this.generateUserToken(
      findUser.email,
    );

    await this.updateUserRefreshToken(findUser, tokenResponse.refreshToken);

    return tokenResponse;
  }

  async refreshToken(
    user: User,
    refreshTokenRequest: RefreshTokenRequest,
  ): Promise<TokenResponse> {
    user.validateEncodedRefreshToken(refreshTokenRequest.refreshToken);

    const tokenResponse: TokenResponse = await this.generateUserToken(
      user.email,
    );

    await this.updateUserRefreshToken(user, tokenResponse.refreshToken);

    return tokenResponse;
  }

  private async updateUserRefreshToken(user: User, refreshToken: string) {
    user.updateRefreshToken(refreshToken);
    await this.userRepository.save(user);
  }

  private async generateUserToken(email: string): Promise<TokenResponse> {
    const accessToken: string = await this.generateAccessToken(email);
    const refreshToken: string = await this.generateRefreshToken(email);

    return new TokenResponse({ accessToken, refreshToken });
  }

  private async generateRefreshToken(email: string): Promise<string> {
    return await this.jwtService.signAsync(
      {
        email,
      },
      {
        secret: config.get('jwt.refreshSecret'),
        expiresIn: config.get('jwt.refreshExpiresIn'),
      },
    );
  }

  private async generateAccessToken(email: string): Promise<string> {
    return await this.jwtService.signAsync({ email });
  }
}
