import { WorkbookResponse } from './workbook.response';

export class WorkbookListResponse {
  list: WorkbookResponse[];

  constructor(workbookResponseList: WorkbookResponse[]) {
    this.list = workbookResponseList;
  }
}
