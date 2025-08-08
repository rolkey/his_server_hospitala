import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H40Sqzb } from './h40_sqzb.entity';
import { H40SqzbService } from './h40-sqzb.service';
import { H40SqzbController } from './h40-sqzb.controller';
// import { H12RyjlModule } from '../h12_ryjl/h12-ryjl.module';
import { H12Ryjl } from '../h12_ryjl/h12_ryjl.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([H40Sqzb, H12Ryjl]), // 注册实体
    // forwardRef(() => H12RyjlModule),
  ],
  controllers: [H40SqzbController], // 注册控制器
  providers: [H40SqzbService], // 注册服务
  exports: [H40SqzbService], // 导出服务，以便其他模块可以使用
})
export class H40SqzbModule {}
