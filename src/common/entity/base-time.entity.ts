import { BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseTimeEntity extends BaseEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
