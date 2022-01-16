import { User } from 'src/auth/entities/user.entity';
import { BaseTimeEntity } from 'src/common/entity/base-time.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WorkbookCard } from './workbook-card.entity';
import { WorkbookLike } from './workbook-like.entity';

@Entity({
  orderBy: {
    createdAt: 'DESC',
  },
})
export class Workbook extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => User)
  user: User;

  @OneToMany(() => WorkbookLike, (like) => like.workbook, { cascade: true })
  likes: WorkbookLike[];

  @OneToMany(() => WorkbookCard, (card) => card.workbook, { cascade: true })
  cards: WorkbookCard[];

  updateInfo({ title }) {
    this.title = title;
  }

  addCard(card: WorkbookCard) {
    this.cards.push(card);
  }
}
