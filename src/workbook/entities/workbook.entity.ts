import { User } from 'src/auth/entities/user.entity';
import { BaseTimeEntity } from 'src/common/entity/base-time.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @ManyToOne((type) => User)
  user: User;
}
