import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpRequest {
  @IsEmail()
  @MinLength(4)
  @MaxLength(20)
  email: string;
  @IsString()
  @MaxLength(20)
  @Matches(
    /^^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/,
    {
      message:
        'password : 문자, 숫자, 특수문자를 포함한 최소 8자리여야 합니다.',
    },
  )
  password: string;
  @IsString()
  @MaxLength(20)
  @Matches(
    /^^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/,
    {
      message:
        'passwordCheck : 문자, 숫자, 특수문자를 포함한 최소 8자리여야 합니다.',
    },
  )
  passwordCheck: string;
}
