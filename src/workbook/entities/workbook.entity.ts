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

@Entity({
  orderBy: {
    createdAt: 'DESC',
  },
})
export class Workbook extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany((type) => WorkbookCard, (card) => card.workbook, { cascade: true })
  cards: WorkbookCard[];

  @Column()
  title: string;

  updateInfo({ title }) {
    this.title = title;
  }

  addCard(card: WorkbookCard) {
    this.cards.push(card);
  }
}
