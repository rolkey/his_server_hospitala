import { Global, Module } from '@nestjs/common';
import { chsService } from './chs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { chsController } from './chs.controller';
import { G01Ryxx } from './G01Ryxx';
import { G01Cbxx } from './G01Cbxx';
import { G10Djxx } from './G10Djxx';
import { G50Zdxx } from './G50Zdxx';
import { G60Jsxx } from './G60Jsxx';
import { G60Fymx } from './G60Fymx';
import { G60Jsmx } from './G60Jsmx';
import { G60JsxxZf } from './G60JsxxZf';
import { G00Dyzd } from './G00Dyzd';
// import { h23_cfmx } from '../h23_cfzb/h23_cfmx.entity';
import { G01Log } from './G01Log';
import { G01Sfxx } from './G01Sfxx';
import { H00_xmzd } from '../h00_xmzd/h00_xmzd.entity';
import { G10Dzzh } from './G10Dzzh';
import { G60Dzjs } from './G60Dzjs';
import { H15Ssxb } from '../h15_ssxb/h15-ssxb.entity';
import { H23Cfmx } from '../h23_cfmx/h23_cfmx.entity';
import { h13_yzzxcs } from '../​​h13_yzzxcs​​/h13_yzzxcs.entity';
@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      G01Ryxx,
      G10Djxx,
      G60Jsxx,
      G60Jsmx,
      G60Fymx,
      G60JsxxZf,
      G00Dyzd,
      G01Log,
      G01Sfxx,
      G10Dzzh,
      G60Dzjs,
      G50Zdxx,
      G01Cbxx,
      H23Cfmx,
      H00_xmzd,
      h13_yzzxcs,
      H15Ssxb,
    ]),
  ],
  controllers: [chsController],
  providers: [chsService],
  exports: [chsService],
})
export class chsModule { }
