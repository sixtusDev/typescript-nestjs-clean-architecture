import { NestUserModule } from '@identity-and-access/presentation/nest-modules/NestUserModule';
import { Module } from '@nestjs/common';
import { NestSharedModule } from './NestSharedModule';
import { NestNotificationModule } from '@notification/presentation/nest-modules/NestNotificationModule';
import { NestAuthModule } from '@identity-and-access/presentation/nest-modules/NestAuthModule';

@Module({ imports: [NestSharedModule, NestAuthModule, NestUserModule, NestNotificationModule] })
export class NestAppModule {}
