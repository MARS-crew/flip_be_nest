import { IsString, MinLength } from 'class-validator';

export class UpdateWorkBookCardRequest {
  @IsString()
  @MinLength(1, {
    message: 'question은 공백일 수 없습니다.',
  })
  question: string;

  @IsString()
  @MinLength(1, {
    message: 'result은 공백일 수 없습니다.',
  })
  result: string;
}
