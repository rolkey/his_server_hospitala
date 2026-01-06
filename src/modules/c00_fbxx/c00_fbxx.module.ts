import { Global, Module } from '@nestjs/common';
import { C00Fbxx } from './c00_fbxx.entity';
import { C00FbxxController } from './c00_fbxx.controller';
import { C00FbxxService } from './c00_fbxx.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global() // 如果要设置为全局模块，可以加上这个装饰器
@Module({
  imports: [TypeOrmModule.forFeature([C00Fbxx])],
  controllers: [C00FbxxController], // 如果需要控制器就取消注释
  providers: [C00FbxxService],
  exports: [C00FbxxService], // 导出 Service 以便其他模块使用
})
export class C00FbxxModule {}
