import { TokenProvider } from '@/common/utils/token-provider';
import { Test, TestingModule } from '@nestjs/testing';
import { UserFactory } from 'test/utils/user.factory';
import { AuthService } from '../application/auth.service';
import { UserRepository } from '../infrastructure/user.repository';
import { LoginRequest } from '../interfaces/login.request';

const mockUserInfo = { email: 'test@test.com', password: '1234' };
const mockToken = 'a.b.c';
const mockTokenProvider = {
  generateRefreshToken() {
    return mockToken;
  },
  generateAccessToken() {
    return mockToken;
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
});

const generateLoginRequest = async ({
  email = mockUserInfo.email,
  password = mockUserInfo.password,
}) => {
  return new LoginRequest({ email, password });
};
