import { Workbook } from '../entities/workbook.entity';

export class WorkbookResponse {
  constructor(workbook: Workbook) {
    this.id = workbook.id;
    this.title = workbook.title;
    this.userId = workbook.user.id;
  }
  id: number;
  title: string;
  userId: number;
}
