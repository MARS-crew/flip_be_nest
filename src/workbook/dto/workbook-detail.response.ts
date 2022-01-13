import { UserInfoResponse } from '@/user/dto/user-info.response';
import { Workbook } from '../entities/workbook.entity';
import { WorkbookCardResponse } from './workbook-card.response';

export class WorkbookDetailResponse {
  id: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  user: UserInfoResponse;
  cards: WorkbookCardResponse[];

  constructor(workbook: Workbook) {
    this.id = workbook.id;
    this.title = workbook.title;
    this.createdAt = workbook.createdAt;
    this.updatedAt = workbook.updatedAt;
    this.user = new UserInfoResponse(workbook.user);
    this.cards = workbook.cards.map((card) => new WorkbookCardResponse(card));
  }
}
