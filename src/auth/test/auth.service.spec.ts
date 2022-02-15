import { TokenProvider } from '@/common/utils/token-provider';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserFactory } from 'test/utils/user.factory';
import { AuthService } from '../application/auth.service';
import { UserRepository } from '../infrastructure/user.repository';
import { LoginRequest } from '../interfaces/login.request';
import { TokenResponse } from '../interfaces/token.response';

const mockUserInfo = { email: 'test@test.com', password: '1234' };
const mockAccessToken = 'access.token.c';
const mockRefreshToken = 'refresh.token.c';

const mockTokenProvider = {
  generateAccessToken() {
    return mockAccessToken;
  },
  generateRefreshToken() {
    return mockRefreshToken;
  },
};

describe('AuthService unit test', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let user;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserRepository,
        { provide: TokenProvider, useValue: mockTokenProvider },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    user = await UserFactory.user({
      email: mockUserInfo.email,
      password: mockUserInfo.password,
    });
  });

  it('로그인 성공', async () => {
    // given
    const loginRequest = await generateLoginRequest({});

    const userRepositoryFindOneSpy = jest
      .spyOn(userRepository, 'findOne')
      .mockResolvedValue(user);

    const userRepositorySaveSpy = jest
      .spyOn(userRepository, 'save')
      .mockResolvedValue(user);

    // when
    await authService.login(loginRequest);

    // then
    expect(userRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
    expect(userRepositoryFindOneSpy).toHaveBeenCalledWith({
      email: loginRequest.email,
    });

    expect(userRepositorySaveSpy).toHaveBeenCalledTimes(1);
    expect(userRepositorySaveSpy).toHaveBeenCalledWith(user);
  });

  it('로그인 성공 - refreshToken 저장', async () => {
    // given
    const loginRequest = await generateLoginRequest({});

    const userRepositoryFindOneSpy = jest
      .spyOn(userRepository, 'findOne')
      .mockResolvedValue(user);

    const userRepositorySaveSpy = jest
      .spyOn(userRepository, 'save')
      .mockResolvedValue(user);

    // when
    const result: TokenResponse = await authService.login(loginRequest);

    // then

    expect(user.refreshToken).toBe(result.refreshToken);
    expect(user.refreshToken).toBe(mockRefreshToken);

    expect(userRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
    expect(userRepositoryFindOneSpy).toHaveBeenCalledWith({
      email: loginRequest.email,
    });

    expect(userRepositorySaveSpy).toHaveBeenCalledTimes(1);
    expect(userRepositorySaveSpy).toHaveBeenCalledWith(user);
  });

  it('로그인 실패 - 존재하지 않는 회원', async () => {
    // given
    const loginRequest = await generateLoginRequest({
      email: 'asd@test.com',
      password: '1234',
    });

    const userRepositoryFindOneSpy = jest
      .spyOn(userRepository, 'findOne')
      .mockResolvedValue(null);

    // when

    try {
      await authService.login(loginRequest);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }

    // then

    expect(userRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
    expect(userRepositoryFindOneSpy).toHaveBeenCalledWith({
      email: loginRequest.email,
    });
  });

  it('로그인 실패 - 비밀번호 불일치', async () => {
    // given
    const loginRequest = await generateLoginRequest({
      password: 'anotherPassword',
    });

    const userRepositoryFindOneSpy = jest
      .spyOn(userRepository, 'findOne')
      .mockResolvedValue(user);

    // when
    try {
      await authService.login(loginRequest);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }

    // then
    expect(userRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
    expect(userRepositoryFindOneSpy).toHaveBeenCalledWith({
      email: loginRequest.email,
    });
  });

  it('로그아웃 성공', async () => {
    // given
    const userRepositoryRemoveRefreshTokenSpy = jest
      .spyOn(userRepository, 'removeRefreshToken')
      .mockReturnThis();

    // when
    await authService.logout(user);

    // then

    expect(userRepositoryRemoveRefreshTokenSpy).toHaveBeenCalledTimes(1);
    expect(userRepositoryRemoveRefreshTokenSpy).toHaveBeenCalledWith(user);
  });
});

const generateLoginRequest = async ({
  email = mockUserInfo.email,
  password = mockUserInfo.password,
}) => {
  return LoginRequest.of({ email, password });
};
