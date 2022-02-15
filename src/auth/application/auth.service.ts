import { BcryptUtils } from '@/common/utils/bcrypt.utils';
import { TokenProvider } from '@/common/utils/token-provider';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { UserRepository } from '../infrastructure/user.repository';
import { LoginRequest } from '../interfaces/login.request';
import { RefreshTokenRequest } from '../interfaces/refresh-token.request';
import { SignUpRequest } from '../interfaces/sign-up.request';
import { TokenResponse } from '../interfaces/token.response';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly tokenProvider: TokenProvider,
  ) {}

  async signUp(signUpRequest: SignUpRequest): Promise<TokenResponse> {
    const { email, password } = signUpRequest;

    const exists = await this.userRepository.findOne({ email });

    if (exists) {
      throw new ConflictException('Existing email');
    }

    const encodedPassword = await BcryptUtils.encode(password);

    const newUser = User.of({ email, encodedPassword });
    await this.userRepository.save(newUser);

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

  async logout(user: User): Promise<void> {
    await this.userRepository.removeRefreshToken(user);
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
    const accessToken: string = await this.tokenProvider.generateAccessToken(
      email,
    );
    const refreshToken: string = await this.tokenProvider.generateRefreshToken(
      email,
    );

    return new TokenResponse({ accessToken, refreshToken });
  }
}
