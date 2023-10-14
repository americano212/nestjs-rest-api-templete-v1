import { Column, Entity } from 'typeorm';
import { CoreEntity } from './core.entity';
import { Role } from 'src/common/enums/role.enum';

// import { ApiProperty } from '@nestjs/swagger';

@Entity('user')
export class UserEntity extends CoreEntity {
  @Column({ unique: true })
  public email!: string;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.User],
  })
  public roles!: Role[];
}
