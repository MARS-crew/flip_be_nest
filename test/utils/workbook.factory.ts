import {
  WorkbookLike,
  WorkbookLikeType,
} from '@/workbook/domain/workbook-like.entity';
import { Workbook } from '@/workbook/domain/workbook.entity';
import * as _ from 'lodash';

export class WorkBookFactory {
  static workbook({ id = 1, title, user, cards = [], likes = [] }): Workbook {
    const workbook: Workbook = new Workbook();

    workbook.id = id;
    workbook.title = title;
    workbook.user = user;
    workbook.cards = cards;
    workbook.likes = likes;
    return workbook;
  }

  static workbookList({ count, user, cards = [], likes = [] }): Workbook[] {
    return _.range(0, count).map((x) => {
      return this.workbook({
        id: x,
        title: `test_title_${x}`,
        user,
        cards,
        likes: [...likes.map((like) => (like.workbook.id = x))],
      });
    });
  }

  static workbookLike({
    id = 1,
    type = WorkbookLikeType.LIKE,
    userId,
    workbook = undefined,
  }): WorkbookLike {
    const workbookLike = WorkbookLike.of(type, userId, workbook);
    workbookLike.id = id;

    return workbookLike;
  }
}
