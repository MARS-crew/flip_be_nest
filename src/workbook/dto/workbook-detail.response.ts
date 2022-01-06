import { Workbook } from '../entities/workbook.entity';
import { WorkbookCardResponse } from './workbook-card.response';

export class WorkbookDetailResponse {
  id: number;
  title: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  cards: WorkbookCardResponse[];

  constructor(workbook: Workbook) {
    this.id = workbook.id;
    this.title = workbook.title;
    this.userId = workbook.user.id;
    this.createdAt = workbook.createdAt;
    this.updatedAt = workbook.updatedAt;
    this.cards = workbook.cards.map((card) => new WorkbookCardResponse(card));
  }
}
