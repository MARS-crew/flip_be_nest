import { User } from '@/auth/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../auth/user.repository';
import { UserInfoResponse } from './dto/user-info.response';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async me(user: User): Promise<UserInfoResponse> {
    const findUser = await this.userRepository.findOne({ id: user.id });

    return new UserInfoResponse(findUser);
  }
}
