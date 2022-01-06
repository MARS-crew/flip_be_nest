import { IsString } from 'class-validator';

export class CreateWorkBookCardRequest {
  @IsString()
  question: string;

  @IsString()
  result: string;
}
