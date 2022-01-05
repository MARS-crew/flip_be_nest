import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
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

    const salt = await bcrypt.genSalt();

    const encodedPassword = await bcrypt.hash(password, salt);

    const newUser = this.create({ email: email, password: encodedPassword });
    await newUser.save();

    return newUser;
  }
}
