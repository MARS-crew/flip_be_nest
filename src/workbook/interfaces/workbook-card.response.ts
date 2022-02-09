import { WorkbookCard } from '../domain/workbook-card.entity';

export class WorkbookCardResponse {
  id: number;
  question: string;
  result: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(workbookCard: WorkbookCard) {
    this.id = workbookCard.id;
    this.question = workbookCard.question;
    this.result = workbookCard.result;
    this.createdAt = workbookCard.createdAt;
    this.updatedAt = workbookCard.updatedAt;
  }
}
