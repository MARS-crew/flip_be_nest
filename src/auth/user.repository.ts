import { BcryptUtils } from '@/common/utils/bcrypt.utils';
import { ConflictException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { SignUpRequest } from './dto/sign-up.request';
import { User } from './entities/user.entity';
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(signUpRequest: SignUpRequest): Promise<User> {
    const { email, password } = signUpRequest;

    const exists = await this.findOne({ email });

    if (exists) {
      throw new ConflictException('Existing email');
    }

    const encodedPassword = await BcryptUtils.encode(password);

    const newUser = await User.of({ email, encodedPassword });
    await this.save(newUser);

    return newUser;
  }

  async removeRefreshToken(user: User): Promise<void> {
    this.update({ id: user.id }, { refreshToken: null });
  }
}
