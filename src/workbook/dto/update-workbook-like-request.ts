import { IsEnum } from 'class-validator';
import { WorkbookLikeType } from '../entities/workbook-like.entity';

export class UpdateWorkbookLikeRequest {
  @IsEnum(WorkbookLikeType)
  type: WorkbookLikeType;
}
