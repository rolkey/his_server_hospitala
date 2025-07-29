import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H31_kcxxController } from './h31_kcxx.controller';
import { H31_kcxxService } from './h31_kcxx.service';
import { H31_kcxx } from './h31_kcxx.entity';
import { H30_ypzd } from '../h30_ypzd/h30_ypzd.entity';
import { H00_xmzd } from '../h00_xmzd/h00_xmzd.entity'; // 直接引入 Entity

@Module({
  imports: [TypeOrmModule.forFeature([H31_kcxx, H00_xmzd, H30_ypzd])],
  controllers: [H31_kcxxController],
  providers: [H31_kcxxService],
  exports: [H31_kcxxService], // 如果其他模块需要使用该服务则导出
})
export class H31_kcxxModule {}
