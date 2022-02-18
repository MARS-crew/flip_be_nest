import { User } from '@/auth/domain/user.entity';
import { BcryptUtils } from '@/common/utils/bcrypt.utils';

export class UserFactory {
  static async user({ id = 1, email, password }): Promise<User> {
    const encodedPassword = await BcryptUtils.encode(password);

    const user = User.of({ email, encodedPassword });
    user.id = id;

    return user;
  }
}
