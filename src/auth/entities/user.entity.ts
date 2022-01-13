import { BaseTimeEntity } from '@/common/entity/base-time.entity';
import * as bcrypt from 'bcrypt';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from './profile';

@Entity()
export class User extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column(() => Profile)
  profile: Profile;

  static async of(payload: {
    email: string;
    encodedPassword: string;
  }): Promise<User> {
    const user = new User();
    user.email = payload.email;
    user.password = payload.encodedPassword;
    user.profile = await Profile.of(payload.email, null);

    return user;
  }

  async updatePassword(encodedPassword: string) {
    this.password = encodedPassword;
  }

  async validatePassword(rawPassword: string): Promise<boolean> {
    return await bcrypt.compare(rawPassword, this.password);
  }
}
