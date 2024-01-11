import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user_role')
export class UserRole {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'user_role_id',
  })
  userRoleId!: number;

  @ApiProperty({ example: 'Test' })
  @Column({ type: 'varchar', nullable: false })
  @IsNotEmpty()
  @Length(4, 12)
  @IsString()
  public roleName!: string;

  @ManyToOne(() => User, (user) => user.roles, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @ManyToOne(() => Role, (role) => role.users, { cascade: true })
  @JoinColumn({ name: 'role_id' })
  role?: Role;
}
