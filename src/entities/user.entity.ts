import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CoreEntity } from './core.entity';
import { IsInt, IsString } from 'class-validator';
import { UserRole } from './user_role.entity';

@Entity('user')
export class User extends CoreEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true, name: 'id' })
  @IsInt()
  public user_id!: number;

  @Column()
  @IsString()
  public username!: string;

  @Column({ select: false })
  @IsString()
  public passwordHash!: string;

  @Column({ unique: true })
  @IsString()
  public email!: string;

  @Column()
  @IsString()
  refreshToken?: string;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  roles?: UserRole[];
}
