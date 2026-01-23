import { Global, Module } from '@nestjs/common';
import { emr_jcffService } from './emr_jcff.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { emr_jcff } from './emr_jcff.entity';
import { emr_jcffController } from './emr_jcff.controller';

import { emr_xmfl } from '../emr_xmfl/emr_xmfl.entity';
import { H00_xmzd } from '../h00_xmzd/h00_xmzd.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([emr_jcff, H00_xmzd, emr_xmfl])],
  controllers: [emr_jcffController],
  providers: [emr_jcffService],
  exports: [emr_jcffService],
})
export class emr_jcffModule {}
