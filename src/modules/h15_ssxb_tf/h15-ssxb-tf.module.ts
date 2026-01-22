import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H15SsxbTf } from './h15-ssxb-tf.entity';
import { H15SsxbTfService } from './h15-ssxb-tf.service';
import { H15Sszb } from '../h15_sszb/h15-sszb.entity';
import { H15Ssxb } from '../h15_ssxb/h15-ssxb.entity';

@Module({
  imports: [TypeOrmModule.forFeature([H15SsxbTf, H15Sszb, H15Ssxb])],
  providers: [H15SsxbTfService],
  exports: [H15SsxbTfService], // 导出Service以便其他Module使用
})
export class H15SsxbTfModule {}
