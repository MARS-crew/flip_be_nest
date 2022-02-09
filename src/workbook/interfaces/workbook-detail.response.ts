import { UserInfoResponse } from '@/user/interfaces/user-info.response';
import { Workbook } from '../domain/workbook.entity';
import { WorkbookCardResponse } from './workbook-card.response';

export class WorkbookDetailResponse {
  readonly id: number;
  readonly title: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly user: UserInfoResponse;
  readonly cards: WorkbookCardResponse[];
  readonly likeCount: number;
  readonly hasLike: boolean;

  constructor(workbook: Workbook, userId: number) {
    this.id = workbook.id;
    this.title = workbook.title;
    this.createdAt = workbook.createdAt;
    this.updatedAt = workbook.updatedAt;
    this.user = new UserInfoResponse(workbook.user);
    this.cards = workbook.cards.map((card) => new WorkbookCardResponse(card));
    this.likeCount = workbook.likes?.length;
    this.hasLike = workbook.likes?.filter((like) => like.userId === userId)
      .length
      ? true
      : false;
  }
}
