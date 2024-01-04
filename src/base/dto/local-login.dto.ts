import { PickType } from '@nestjs/mapped-types';
import { LocalRegisterDto } from 'src/shared/user/dto';

export class LocalLoginDto extends PickType(LocalRegisterDto, ['email', 'password' as const]) {}
