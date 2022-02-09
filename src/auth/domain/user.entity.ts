import { BaseTimeEntity } from '@/common/entity/base-time.entity';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
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

  @Column({ nullable: true })
  refreshToken?: string;

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

  async validatePassword(rawPassword: string): Promise<void> {
    if (!(await bcrypt.compare(rawPassword, this.password))) {
      throw new BadRequestException('Invalid Password');
    }
  }

  updateRefreshToken(encodedRefreshToken: string) {
    this.refreshToken = encodedRefreshToken;
  }

  validateEncodedRefreshToken(rawRefreshToken: string): void {
    if (rawRefreshToken !== this.refreshToken) {
      throw new UnauthorizedException('Invalid RefreshToken');
    }
  }
}
