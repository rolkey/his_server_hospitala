import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H11Fpzb } from './h11_fpzb.entity';
import { H11FpzbService } from './h11_fpzb.service';
import { H11FpzbController } from './h11_fpzb.controller';
import { H11ZypjService } from '../h11_zypj/h11_zypj.service';
import { H11Zypj } from '../h11_zypj/h11_zypj.entity';
import { H11JszbService } from '../h11_jszb/h11_jszb.service';
import { H11Jszb } from '../h11_jszb/h11_jszb.entity';
import { h11_lsh } from '../h11_lsh/h11_lsh.entity';
import { h11_lshService } from '../h11_lsh/h11_lsh.service';
import { H11YjkService } from '../h11_yjk/h11_yjk.service';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';
import { H11Yjk } from '../h11_yjk/h11_yjk.entity';
import { H11JsxbService } from '../h11_jsxb/h11_jsxb.service';
import { H11Jsxb } from '../h11_jsxb/h11_jsxb.entity';
import { ParamService } from '../h12_xmzd/service/param.service';
import { Syspar } from '../h12_xmzd/entity/syspar.entity';
import { SysparNew } from '../h12_xmzd/entity/__syspar_new.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      H11Fpzb,
      H11Zypj,
      H11Jszb,
      h11_lsh,
      h11_brxx,
      H11Yjk,
      H11Jsxb,
      Syspar,
      SysparNew,
    ]),
  ],
  controllers: [H11FpzbController],
  providers: [
    H11FpzbService,
    H11ZypjService,
    H11JszbService,
    h11_lshService,
    H11YjkService,
    H11JsxbService,
    ParamService,
  ],
  exports: [H11FpzbService],
})
export class H11FpzbModule {}
