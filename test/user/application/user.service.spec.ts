import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../src/user/application/user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });
});
