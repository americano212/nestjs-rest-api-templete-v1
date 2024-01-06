import { PickType } from '@nestjs/swagger';
import { LocalRegisterDto } from 'src/shared/user/dto';

export class LocalLoginDto extends PickType(LocalRegisterDto, ['email', 'password'] as const) {}
