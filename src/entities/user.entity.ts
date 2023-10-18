import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CoreEntity } from './core.entity';
import { IsInt, IsString } from 'class-validator';

@Entity('user')
export class UserEntity extends CoreEntity {
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
}
