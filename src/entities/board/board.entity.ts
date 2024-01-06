import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsInt, IsString } from 'class-validator';

import { CoreEntity } from '..';
import { Content } from '.';
import { ApiProperty } from '@nestjs/swagger';

@Entity('board')
export class Board extends CoreEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true, name: 'board_id' })
  @IsInt()
  public boardId!: number;

  @ApiProperty({ example: 'Admin Board' })
  @Column({ type: 'varchar', nullable: false, unique: true })
  @IsString()
  public boardName!: string;

  @ApiProperty({ example: ['SuperAdmin'] })
  @Column({ type: 'json', nullable: false })
  @IsString({ each: true })
  public boardReadRoles!: string[];

  @ApiProperty({ example: ['SuperAdmin'] })
  @Column({ type: 'json', nullable: false })
  @IsString({ each: true })
  public boardWriteRoles!: string[];

  @OneToMany(() => Content, (content) => content.board)
  public contents?: Content[];
}
