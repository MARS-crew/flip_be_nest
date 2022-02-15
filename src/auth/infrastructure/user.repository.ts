import { EntityRepository, Repository } from 'typeorm';
import { User } from '../domain/user.entity';
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async removeRefreshToken(user: User): Promise<void> {
    this.update({ id: user.id }, { refreshToken: null });
  }
}
