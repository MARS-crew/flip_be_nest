import * as bcrypt from 'bcrypt';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from './profile';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column(() => Profile)
  profile: Profile;

  static async of(email: string, encodedPassword: string): Promise<User> {
    const user = new User();
    user.email = email;
    user.password = encodedPassword;
    user.profile = await Profile.of(email, null);

    return user;
  }

  async updatePassword(encodedPassword: string) {
    this.password = encodedPassword;
  }

  async validatePassword(rawPassword: string): Promise<boolean> {
    return await bcrypt.compare(rawPassword, this.password);
  }
}
