import { Workbook } from '@/workbook/domain/workbook.entity';
import * as _ from 'lodash';

export class WorkBookFactory {
  static workbook({ id = 1, title, user, cards = [], likes = [] }) {
    const workbook: Workbook = new Workbook();

    workbook.id = id;
    workbook.title = title;
    workbook.user = user;
    workbook.cards = cards;
    workbook.likes = likes;
    return workbook;
  }

  static workbookList({ count, user }): Workbook[] {
    return _.range(0, count).map((x) =>
      this.workbook({ id: x, title: `test_title_${x}`, user }),
    );
  }
}
