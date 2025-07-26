import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H31KcxxController } from './h31_kcxx.controller';
import { H31_kcxxService } from './h31_kcxx.service';
import { H31_kcxx } from './h31_kcxx.entity';

@Module({
  imports: [TypeOrmModule.forFeature([H31_kcxx])],
  controllers: [H31KcxxController],
  providers: [H31_kcxxService],
  exports: [H31_kcxxService], // 如果其他模块需要使用该服务则导出
})
export class H31KcxxModule {}
