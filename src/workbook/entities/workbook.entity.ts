import { User } from 'src/auth/entities/user.entity';
import { BaseTimeEntity } from 'src/common/entity/base-time.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WorkBookCard } from './workbook-card.entity';

@Entity({
  orderBy: {
    createdAt: 'DESC',
  },
})
export class Workbook extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User)
  user: User;

  @OneToMany((type) => WorkBookCard, (card) => card.workbook)
  cards: WorkBookCard[];

  @Column()
  title: string;

  updateInfo({ title }) {
    this.title = title;
  }
}
