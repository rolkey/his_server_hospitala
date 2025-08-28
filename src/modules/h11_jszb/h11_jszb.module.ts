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

@Module({
  imports: [TypeOrmModule.forFeature([H11Jszb, H11Zypj, h11_brxx, h11_lsh, H11Yjk, H11Fpzb])],
  controllers: [H11JszbController],
  providers: [
    H11JszbService,
    H11ZypjService,
    h11_lshService,
    h11_brxxService,
    H11YjkService,
    H11FpzbService,
  ],
  exports: [H11JszbService],
})
export class H11JszbModule {}
