import { BaseTimeEntity } from 'src/common/entity/base-time.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Workbook } from './workbook.entity';

@Entity()
export class WorkbookCard extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Workbook, (workbook) => workbook.cards, {
    onDelete: 'CASCADE',
  })
  workbook: Workbook;

  @Column()
  question: string;

  @Column()
  result: string;

  updateInfo({ question, result }) {
    this.question = question;
    this.result = result;
  }
}
