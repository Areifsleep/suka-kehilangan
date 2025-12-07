import {
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { passwordConstraints } from 'src/common/constants';

export class UserRegistrationBodyDto {
  @IsDefined()
  @IsEmail()
  username: string;

  @IsDefined()
  @MinLength(passwordConstraints.minLength)
  @MaxLength(passwordConstraints.maxLength)
  @Matches(passwordConstraints.pattern, {
    message:
      'The password must contain minimum 8 and maximum 64 characters, at least one uppercase letter, one lowercase letter, one number and one special character #?!@$%^&*()-',
  })
  password: string;

  @IsDefined()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName?: string;
}
