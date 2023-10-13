import { Global, Module } from '@nestjs/common';
import * as providers from './providers';

const services = Object.values(providers);

@Global()
@Module({ providers: services, exports: services })
export class CommonModule {}
