import { IsString, MinLength } from 'class-validator';

export class RefreshTokenRequest {
  @IsString()
  @MinLength(1, {
    message: 'refreshToken은 공백일 수 없습니다.',
  })
  readonly refreshToken: string;
}
