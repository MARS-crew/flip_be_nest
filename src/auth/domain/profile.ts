import { Column } from 'typeorm';

export class Profile {
  @Column({ nullable: true })
  nickname: string;

  @Column({ nullable: true })
  photo: string;

  static of(nickname: string, photo: string): Profile {
    const profile = new Profile();
    profile.nickname = nickname;
    profile.photo = photo;

    return profile;
  }
}
