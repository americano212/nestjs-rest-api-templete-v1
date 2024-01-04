import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CoreEntity } from './core.entity';
import { IsInt, IsString } from 'class-validator';
import { UserRole } from './user-role.entity';
import { Content } from './board';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user')
export class User extends CoreEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true, name: 'user_id' })
  @IsInt()
  public user_id!: number;

  @ApiProperty({ example: '홍길동' })
  @Column({ type: 'varchar', nullable: true })
  @IsString()
  public username?: string;

  @Column({ type: 'varchar', nullable: true, select: false })
  @IsString()
  public passwordHash?: string;

  @ApiProperty({ example: 'test@example.com' })
  @Column({ type: 'varchar', nullable: false, unique: true })
  @IsString()
  public email!: string;

  @Column({ type: 'varchar', nullable: true, select: false })
  @IsString()
  public refreshToken?: string;

  @Column({ type: 'varchar', nullable: true, default: '', select: false })
  @IsString()
  public vendor?: string;

  @Column({ type: 'varchar', nullable: true, unique: true, select: false })
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
