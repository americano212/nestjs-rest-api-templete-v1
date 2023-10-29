import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CoreEntity } from './core.entity';
import { IsInt, IsString } from 'class-validator';
import { UserRole } from './user-role.entity';
import { SocialLoginInfo } from './social-login-info.entity';

@Entity('user')
export class User extends CoreEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true, name: 'user_id' })
  @IsInt()
  public user_id!: number;

  @Column({ type: 'varchar', nullable: true })
  @IsString()
  public username?: string;

  @Column({ type: 'varchar', nullable: true, select: false })
  @IsString()
  public passwordHash?: string;

  @Column({ unique: true })
  @IsString()
  public email!: string;

  @Column({ type: 'varchar', nullable: true })
  @IsString()
  refreshToken?: string;
  // TODO roles? string -> object 수정
  @OneToMany(() => UserRole, (userRole) => userRole.user)
  roles?: string[];

  @OneToMany(() => SocialLoginInfo, (userRole) => userRole.user)
  social_login_infos?: SocialLoginInfo[];
}
