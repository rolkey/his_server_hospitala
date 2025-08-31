import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H11Jszb } from './h11_jszb.entity';
import { H11JszbService } from './h11_jszb.service';
import { H11JszbController } from './h11_jszb.controller';

import { H11ZypjService } from '../h11_zypj/h11_zypj.service';
import { h11_lshService } from '../h11_lsh/h11_lsh.service';
import { h11_brxxService } from '../h11_brxx/h11_brxx.service';
import { H11YjkService } from '../h11_yjk/h11_yjk.service';
import { H11FpzbService } from '../h11_fpzb/h11_fpzb.service';
import { H11Zypj } from '../h11_zypj/h11_zypj.entity';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';
import { h11_lsh } from '../h11_lsh/h11_lsh.entity';
import { H11Yjk } from '../h11_yjk/h11_yjk.entity';
import { H11Fpzb } from '../h11_fpzb/h11_fpzb.entity';
import { h00_fylbService } from '../h00_fylb/h00_fylb.service';
import { h00_fylb } from '../h00_fylb/h00_fylb.entity';
import { H11Jsxb } from '../h11_jsxb/h11_jsxb.entity';
import { H11JsxbService } from '../h11_jsxb/h11_jsxb.service';
import { H11Fpxb } from '../h11_fpxb/h11_fpxb.entity';
import { H11Xnh } from '../h11_xnh/h11_xnh.entity';
import { h12_yzzb } from '../h12_yzzb/h12_yzzb.entity';
import { h13_yzzxcs } from '../​​h13_yzzxcs​​/h13_yzzxcs.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      H11Jszb,
      H11Zypj,
      h11_brxx,
      h11_lsh,
      H11Yjk,
      H11Fpzb,
      h00_fylb,
      H11Jsxb,
      H11Fpxb,
      H11Xnh,
      h12_yzzb,
      h13_yzzxcs,
    ]),
  ],
  controllers: [H11JszbController],
  providers: [
    H11JszbService,
    H11ZypjService,
    h11_lshService,
    h11_brxxService,
    H11YjkService,
    H11FpzbService,
    h00_fylbService,
    H11JsxbService,
  ],
  exports: [H11JszbService],
})
export class H11JszbModule {}
