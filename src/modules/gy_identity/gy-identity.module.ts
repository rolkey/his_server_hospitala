import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GyIdentityService } from './gy-identity.service';
import { GyIdentity } from './gy-identity.entity';
import { GyIdentityController } from './gy-identity.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GyIdentity])],
  providers: [GyIdentityService],
  controllers: [GyIdentityController], // 确保GyIdentityController被导入
  exports: [GyIdentityService],
})
export class GyIdentityModule {}
