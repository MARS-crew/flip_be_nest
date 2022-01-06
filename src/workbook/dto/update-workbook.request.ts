import { IsString } from 'class-validator';

export class UpdateWorkbookRequest {
  @IsString()
  title: string;
}
