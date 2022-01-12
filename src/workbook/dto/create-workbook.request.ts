import { IsString, MinLength } from 'class-validator';

export class CreateWorkbookRequest {
  @IsString()
  @MinLength(1, {
    message: 'title은 공백일 수 없습니다.',
  })
  title: string;
}
