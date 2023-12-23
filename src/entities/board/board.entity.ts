import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsInt, IsString } from 'class-validator';

import { CoreEntity } from '..';
import { Content } from '.';

@Entity('board')
export class Board extends CoreEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true, name: 'board_id' })
  @IsInt()
  public board_id!: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  @IsString()
  public board_name!: string;

  @Column({ type: 'json', nullable: false })
  @IsString({ each: true })
  public board_roles!: string[];

  @OneToMany(() => Content, (content) => content.board)
  public contents?: Content[];
}
