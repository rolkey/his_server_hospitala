import { Global, Module } from '@nestjs/common';
import { emr_jcbwService } from './emr_jcbw.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { emr_jcbw } from './emr_jcbw.entity';
import { emr_jcbwController } from './emr_jcbw.controller';
import { H00_xmzd } from '../h00_xmzd/h00_xmzd.entity';
import { emr_xmfl } from '../emr_xmfl/emr_xmfl.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([emr_jcbw, H00_xmzd, emr_xmfl])],
  controllers: [emr_jcbwController],
  providers: [emr_jcbwService],
  exports: [emr_jcbwService],
})
export class emr_jcbwModule {}
