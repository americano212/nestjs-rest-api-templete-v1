import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsInt, IsString } from 'class-validator';

import { User, CoreEntity } from '..';
import { Board } from '.';

@Entity('content')
export class Content extends CoreEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true, name: 'content_id' })
  @IsInt()
  public content_id!: number;

  @Column({ type: 'varchar', nullable: false })
  @IsString()
  public title!: string;

  @Column({ type: 'text', nullable: false })
  @IsString()
  public content!: string;

  @Column({ type: 'varchar', nullable: true })
  @IsString()
  public author?: string;

  @Column({ type: 'varchar', nullable: true })
  @IsString()
  public ip?: string;

  @ManyToOne(() => User, (user) => user.contents, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user!: User | null;

  @ManyToOne(() => Board, (board) => board.contents, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'board_id' })
  board!: Board | null;
}
