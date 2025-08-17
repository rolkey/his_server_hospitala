import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { h11_lshService } from './h11_lsh.service';
import { h11_lsh } from './h11_lsh.entity';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';
import { h11_brxxService } from '../h11_brxx/h11_brxx.service';
import { h11_lshController } from './h11_lsh.controller';

@Module({
  imports: [TypeOrmModule.forFeature([h11_lsh, h11_brxx])],
  providers: [h11_lshService, h11_brxxService],
  controllers: [h11_lshController], // 确保h11_lshController被导入
  exports: [h11_lshService],
})
export class h11_lshModule {}
