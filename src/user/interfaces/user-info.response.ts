import { Profile } from '@/auth/domain/profile';
import { User } from '@/auth/domain/user.entity';

export class UserInfoResponse {
  id: number;
  email: string;
  profile: Profile;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.profile = user.profile;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
