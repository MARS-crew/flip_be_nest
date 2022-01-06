import { Workbook } from '../entities/workbook.entity';

export class WorkbookResponse {
  id: number;
  title: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(workbook: Workbook) {
    this.id = workbook.id;
    this.title = workbook.title;
    this.userId = workbook.user.id;
    this.createdAt = workbook.createdAt;
    this.updatedAt = workbook.updatedAt;
  }
}
