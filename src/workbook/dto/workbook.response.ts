import { Profile } from '@/auth/entities/profile';
import { Workbook } from '../entities/workbook.entity';

export class WorkbookResponse {
  id: number;
  title: string;
  user: {
    id: number;
    profile: Profile;
  };
  createdAt: Date;
  updatedAt: Date;

  constructor(workbook: Workbook) {
    this.id = workbook.id;
    this.title = workbook.title;
    this.createdAt = workbook.createdAt;
    this.updatedAt = workbook.updatedAt;
  }
}
