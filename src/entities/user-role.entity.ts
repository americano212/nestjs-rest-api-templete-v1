import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';
import { IsString } from 'class-validator';

@Entity()
export class UserRole {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'user_role_id',
  })
  user_role_id!: number;

  @Column({ type: 'varchar', nullable: false })
  @IsString()
  public role_name!: string;

  @ManyToOne(() => User, (user) => user.roles, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Role, (role) => role.users, { cascade: true })
  @JoinColumn({ name: 'role_id' })
  role!: Role;
}
