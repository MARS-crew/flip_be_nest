import { Profile } from '@/auth/entities/profile';
import { User } from '@/auth/entities/user.entity';

export class UserInfoResponse {
  constructor(user: User) {
    this.id = user.id;
    this.profile = user.profile;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  id: number;
  profile: Profile;
  createdAt: Date;
  updatedAt: Date;
}
