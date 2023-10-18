import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CoreEntity } from './core.entity';
import { IsInt, IsString } from 'class-validator';
import { UserRole } from './user_role.entity';

@Entity('role')
export class Role extends CoreEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true, name: 'id' })
  @IsInt()
  public role_id!: number;

  @Column()
  @IsString()
  public role_name!: string;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  users?: UserRole[];
}
