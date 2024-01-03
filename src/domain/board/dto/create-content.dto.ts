import { Board } from '#entities/board';
import { User } from '#entities/index';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateContentDto {
  @ApiProperty({ example: 'Content Title' })
  @IsString()
  public title!: string;

  @ApiProperty({ example: 'Content Content Content' })
  @IsString()
  public content!: string;

  public author?: string;

  public ip?: string;

  public user: User | null;

  public board: Board | null;

  constructor() {
    this.user = null;
    this.board = null;
  }
}
