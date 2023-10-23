import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class SocialLoginInfo {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'socail_login_info_id',
  })
  socail_login_info_id!: number;

  @ManyToOne(() => User, (user) => user.social_login_infos)
  @JoinColumn({ name: 'user_id' })
  user?: User;
}
