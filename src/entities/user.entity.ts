import { Column, Entity } from 'typeorm';
import { CoreEntity } from './core.entity';
import { Role } from 'src/common/enums/role.enum';
import { IsString } from 'class-validator';

// import { ApiProperty } from '@nestjs/swagger';

@Entity('user')
export class UserEntity extends CoreEntity {
  @Column()
  @IsString()
  public username!: string;

  @Column({ select: false })
  @IsString()
  public passwordHash!: string;

  @Column({ unique: true })
  @IsString()
  public email!: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  @IsString()
  public roles!: Role;
}
