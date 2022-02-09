import { UserInfoResponse } from '@/user/interfaces/user-info.response';
import { Workbook } from '../domain/workbook.entity';

export class WorkbookResponse {
  id: number;
  title: string;
  user: UserInfoResponse;
  createdAt: Date;
  updatedAt: Date;

  constructor(workbook: Workbook) {
    this.id = workbook.id;
    this.title = workbook.title;
    this.user = new UserInfoResponse(workbook.user);
    this.createdAt = workbook.createdAt;
    this.updatedAt = workbook.updatedAt;
  }
}
