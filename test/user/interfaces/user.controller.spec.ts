import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../src/user/application/user.service';
import { UserController } from '../../../src/user/interfaces/user.controller';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });
});
