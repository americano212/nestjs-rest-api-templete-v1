import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class CoreEntity {
  @ApiProperty({ example: new Date(), description: '생성 일자' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ example: new Date(), description: '수정 일자' })
  @UpdateDateColumn({ select: false })
  updatedAt!: Date;

  @ApiProperty({ example: new Date(), description: '삭제 일자' })
  @DeleteDateColumn({ select: false })
  deletedAt?: Date | null;
}
