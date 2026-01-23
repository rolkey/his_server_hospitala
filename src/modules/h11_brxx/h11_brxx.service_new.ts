import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { And, DataSource, Repository } from 'typeorm';
import { h11_brxx } from './h11_brxx.entity';
import {
  Queryh11_brxxDto,
  CreateDto,
  UpdateDto,
  QueryCostDetailDto,
  QueryCostCategoryDto,
  bedAllocationDto,
  QueryDto,
  ForciblyDeleteDto,
  receiptDto,
} from './dto';
import dayjs = require('dayjs');
import { h11_lshService } from '../h11_lsh/h11_lsh.service';
import { h11_zybhService } from '../h11_zybh/h11_zybh.service';
import { h00_fylbService } from '../h00_fylb/h00_fylb.service';
import { ParamService } from '../h12_xmzd/service/param.service';
import DateFormater from '@/utils/DateFormater';
import { CustomException } from '@/common/exceptions/custom.exception';
import { ERR } from '@/common/exceptions/error-code';
import { h00_cwxx } from '../h00_cwxx/h00_cwxx.entity';
import { h13_cwsyxx } from '../h13_cwsyxx/h13_cwsyxx.entity';
import { h00_syff } from '../h00_syff/h00_syff.entity';
import { log } from 'console';
@Injectable()
export class h11_brxxService_new {
  constructor(
    @InjectRepository(h11_brxx)
    private h11_brxxRepo: Repository<h11_brxx>,
    private readonly h11_lshService: h11_lshService,
    private readonly h11_zybhService: h11_zybhService,
    private readonly h00_fylbService: h00_fylbService,
    private readonly paramService: ParamService,
    private dataSource: DataSource,
  ) {}

  async updateBedAllocation(data: {
    cwid: string;
    cwidOld: string;
    zyid: string;
    cwmc: string;
    ksid: string;
    userId: string;
    userName: string;
  }) {
    const lrsj = new Date();
    const { cwid, cwidOld, zyid, cwmc, ksid, userId, userName } = data;
    const ls_cwfpxx = `护士"${userName}"在${dayjs(lrsj).format('yyyy.mm.dd hh:mm')}分配`;

    await this.dataSource.transaction(async (manager) => {
      try {
        // 更新床位提示
        await manager.query(`UPDATE h11_jshztzd1 SET cycw = @0 WHERE zyid = @1`, [cwmc, zyid]);

        // 更新病人信息
        await manager.query(
          `UPDATE h11_brxx SET rycw = @0, cycw = @0, zyzt = 2
         WHERE (zyid = @1 OR mmlsh = @1) AND cyksid = @2`,
          [cwid, zyid, ksid],
        );

        // 更新医嘱表
        await manager.query(
          `UPDATE h12_yzzb SET cwid = @0
         WHERE zyid IN (SELECT zyid FROM h11_brxx WHERE zyid = @1 OR mmlsh = @1)`,
          [cwid, zyid],
        );

        // 释放旧床位
        await manager.query(
          `UPDATE h13_cwsyxx SET cwzt = 1, zyid = '', lryid = '', lrsj = '', cwfpxx = ''
         WHERE cwid = @0`,
          [cwidOld],
        );

        // 分配新床位
        await manager.query(
          `UPDATE h13_cwsyxx SET cwzt = 4, zyid = @0, lryid = @1, lrsj = @2, cwfpxx = @3
         WHERE cwid = @4`,
          [zyid, userId, lrsj, ls_cwfpxx, cwid],
        );
      } catch (error) {
        throw new CustomException(ERR.ERR_40103, '床位分配失败');
      }
    });
  }
}
