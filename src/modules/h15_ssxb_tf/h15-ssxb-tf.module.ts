import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H15SsxbTf } from './h15-ssxb-tf.entity';
import { H15SsxbTfService } from './h15-ssxb-tf.service';
import { H15Sszb } from '../h15_sszb/h15-sszb.entity';
import { H15Ssxb } from '../h15_ssxb/h15-ssxb.entity';
import { H15SsxbTfController } from './h15-ssxb-tf.controller';
import { GyIdentityService } from '../gy_identity/gy-identity.service';
import { ParamService } from '../h12_xmzd/service/param.service';
import { GyIdentity } from '../gy_identity/gy-identity.entity';
import { SysparNew } from '../h12_xmzd/entity/__syspar_new.entity';
import { Syspar } from '../h12_xmzd/entity/syspar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([H15SsxbTf, H15Sszb, H15Ssxb, GyIdentity, Syspar, SysparNew])],
  controllers: [H15SsxbTfController],
  providers: [H15SsxbTfService, GyIdentityService, ParamService],
  exports: [H15SsxbTfService], // 导出Service以便其他Module使用
})
export class H15SsxbTfModule {}
