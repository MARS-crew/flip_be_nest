import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginRequest {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1, {
    message: 'password은 공백일 수 없습니다.',
  })
  password: string;
}
