import { IsEnum } from 'class-validator';
import { WorkbookLikeType } from '../domain/workbook-like.entity';

export class UpdateWorkbookLikeRequest {
  @IsEnum(WorkbookLikeType)
  type: WorkbookLikeType;
}
