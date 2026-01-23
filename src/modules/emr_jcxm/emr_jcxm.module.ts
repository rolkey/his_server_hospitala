import { Global, Module } from '@nestjs/common';
import { emr_jcxmService } from './emr_jcxm.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { emr_jcxm } from './emr_jcxm.entity';
import { emr_jcxmController } from './emr_jcxm.controller';
import { emr_jcbw } from '../emr_jcbw/emr_jcbw.entity';
import { emr_jcff } from '../emr_jcff/emr_jcff.entity';
import { emr_xmfl } from '../emr_xmfl/emr_xmfl.entity';
import { emr_jcxmmx } from './emr_jcxmmx.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([emr_jcxm, emr_jcbw, emr_jcff, emr_xmfl, emr_jcxmmx])],
  controllers: [emr_jcxmController],
  providers: [emr_jcxmService],
  exports: [emr_jcxmService],
})
export class emr_jcxmModule {}
