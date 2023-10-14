import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class CoreEntity {
  @ApiProperty({ example: 1, description: 'primary key' })
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true, name: 'id' })
  public id!: number;

  @ApiProperty({ example: new Date(), description: '생성 일자' })
  @CreateDateColumn()
  created_at!: Date;

  @ApiProperty({ example: new Date(), description: '수정 일자' })
  @UpdateDateColumn()
  updated_at!: Date;

  @ApiProperty({ example: new Date(), description: '삭제 일자' })
  @DeleteDateColumn()
  deleted_at?: Date | null;
}
