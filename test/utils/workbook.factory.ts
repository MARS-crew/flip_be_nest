import { Workbook } from '@/workbook/domain/workbook.entity';

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
}
