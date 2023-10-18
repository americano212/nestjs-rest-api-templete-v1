import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CoreEntity } from './core.entity';
import { IsInt, IsString } from 'class-validator';

@Entity('role')
export class RoleEntity extends CoreEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true, name: 'id' })
  @IsInt()
  public role_id!: number;

  @Column()
  @IsString()
  public role_name!: string;
}
