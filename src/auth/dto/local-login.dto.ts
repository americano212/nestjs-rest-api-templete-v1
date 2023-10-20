import { IsString } from 'class-validator';

export class LocalLoginDto {
  @IsString()
  public username!: string;

  @IsString()
  public password!: string;
}
