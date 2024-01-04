import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsInt, IsString } from 'class-validator';

import { UserRole } from './user-role.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true, name: 'role_id' })
  @IsInt()
  public role_id!: number;

  @ApiProperty({ example: 'Test' })
  @Column({ type: 'varchar', nullable: false, unique: true })
  @IsString()
  public role_name!: string;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  users?: UserRole[];
}
