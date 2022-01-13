import { Column } from 'typeorm';

export class Profile {
  @Column({ nullable: true })
  nickname: string;

  @Column({ nullable: true })
  photo: string;

  static async of(nickname: string, photo: string): Promise<Profile> {
    const profile = new Profile();
    profile.nickname = nickname;
    profile.photo = photo;

    return profile;
  }
}
