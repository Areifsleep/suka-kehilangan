import { IsDefined, IsString } from 'class-validator';

export class LoginBodyDto {
  @IsDefined()
  @IsString()
  username: string;

  @IsDefined()
  @IsString()
  password: string;
}
