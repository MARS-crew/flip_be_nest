import { IsString } from 'class-validator';

export class UpdateWorkBookCardRequest {
  @IsString()
  question: string;
  @IsString()
  result: string;
}
