import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsInt, IsNotEmpty, IsString, Max } from 'class-validator';

import { CoreEntity } from '..';
import { Content } from '.';

@Entity('board')
export class Board extends CoreEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true, name: 'board_id' })
  @IsInt()
  public boardId!: number;

  @ApiProperty({ example: 'Admin Board' })
  @Column({ type: 'varchar', nullable: false, unique: true })
  @Max(20)
  @IsNotEmpty()
  @IsString()
  public boardName!: string;

  @ApiProperty({ example: ['SuperAdmin'] })
  @Column({ type: 'json', nullable: false })
  @IsNotEmpty()
  @IsString({ each: true })
  public boardReadRoles!: string[];

  @ApiProperty({ example: ['SuperAdmin'] })
  @Column({ type: 'json', nullable: false })
  @IsNotEmpty()
  @IsString({ each: true })
  public boardWriteRoles!: string[];

  @OneToMany(() => Content, (content) => content.board)
  public contents?: Content[];
}
