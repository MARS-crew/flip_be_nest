import * as bcrypt from 'bcrypt';

export class BcryptUtils {
  static async encode(password): Promise<string> {
    const salt = await bcrypt.genSalt();

    return await bcrypt.hash(password, salt);
  }
}
