import { BaseTimeEntity } from '@/common/entity/base-time.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Workbook } from './workbook.entity';

export enum WorkbookLikeType {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
}

@Entity()
export class WorkbookLike extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: WorkbookLikeType })
  type: WorkbookLikeType;

  @Column()
  userId: number;

  @ManyToOne(() => Workbook, (workbook) => workbook.likes, {
    onDelete: 'CASCADE',
  })
  workbook: Workbook;

  static of(
    type: WorkbookLikeType,
    userId: number,
    workbook: Workbook,
  ): WorkbookLike {
    const workbookLike = new WorkbookLike();
    workbookLike.type = type;
    workbookLike.userId = userId;
    workbookLike.workbook = workbook;

    return workbookLike;
  }

  updateType(type: WorkbookLikeType) {
    this.type = type;
  }
}
