import { IsString } from 'class-validator';

export class CreateWorkbookRequest {
  @IsString()
  title: string;
}
