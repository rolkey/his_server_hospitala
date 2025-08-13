import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H12Ryjl } from './h12_ryjl.entity';
import { H12RyjlService } from './h12-ryjl.service';
import { H12RyjlController } from './h12-ryjl.controller';

@Module({
  imports: [TypeOrmModule.forFeature([H12Ryjl])],
  controllers: [H12RyjlController],
  providers: [H12RyjlService],
  exports: [H12RyjlService], // 如果其他模块需要使用该服务
})
export class H12RyjlModule {}
