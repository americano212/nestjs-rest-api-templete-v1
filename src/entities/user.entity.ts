import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CoreEntity } from './core.entity';
import { IsInt, IsString } from 'class-validator';
import { UserRole } from './user-role.entity';
import { Content } from './board';

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
  public refreshToken?: string;

  @Column({ type: 'varchar', default: '' })
  @IsString()
  public vendor?: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  @IsString()
  public social_id?: string;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  public roles?: UserRole[];

  @OneToMany(() => Content, (content) => content.user)
  public contents?: Content[];

  constructor(userId?: number) {
    super();
    if (userId) this.user_id = userId;
  }
}
