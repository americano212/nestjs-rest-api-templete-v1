import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsInt, IsString } from 'class-validator';

import { User, CoreEntity } from '..';
import { Board } from '.';
import { ApiProperty } from '@nestjs/swagger';

@Entity('content')
export class Content extends CoreEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true, name: 'content_id' })
  @IsInt()
  public contentId!: number;

  @ApiProperty({ example: 'Test Title' })
  @Column({ type: 'varchar', nullable: false })
  @IsString()
  public title!: string;

  @ApiProperty({ example: 'Test Content' })
  @Column({ type: 'text', nullable: false })
  @IsString()
  public content!: string;

  @ApiProperty({ example: 'Author Name' })
  @Column({ type: 'varchar', nullable: true })
  @IsString()
  public author?: string | null;

  @ApiProperty({ example: '127.0.0.1' })
  @Column({ type: 'varchar', nullable: true })
  @IsString()
  public ip?: string | null;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.contents, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user?: User | null;

  @ApiProperty({ type: () => Board })
  @ManyToOne(() => Board, (board) => board.contents, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'board_id' })
  board?: Board | null;
}
