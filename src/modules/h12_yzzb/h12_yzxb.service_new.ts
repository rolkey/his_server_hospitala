import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { h12_yzzb } from './h12_yzzb.entity';
import { h12_yzxb } from './h12_yzxb.entity';
import { GyIdentityService } from '../gy_identity/gy-identity.service';
import { executeDto, reviewDto } from './dto/h12_yzzbOpe.dto';
import { CustomException } from '@/common/exceptions/custom.exception';
import { ERR } from '@/common/exceptions/error-code';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';
import { syspar_newService } from '../syspar_new/syspar_new.service';
/**
 * 单一个Service程序过多，应该把一部分功能拆分出来，放在new里面
 */
@Injectable()
export class h12_yzxbServiceNew {
  constructor(
    @InjectRepository(h12_yzzb)
    private h12_yzzbRepo: Repository<h12_yzzb>,
    @InjectRepository(h12_yzxb)
    private h12_yzxbRepo: Repository<h12_yzxb>,
    private readonly gyIdentityService: GyIdentityService,
    private dataSource: DataSource,
    private readonly syspar_newService: syspar_newService
  ) { }

  // 取组套
  async addPackageToAdvice() { }


  //护士复核医嘱
  async review(dto: reviewDto) {

    const [yzzb, yzxbList] = await Promise.all([
      this.h12_yzzbRepo.findOne({
        where: {
          zyid: dto.zyid,
          yzlx: dto.yzlx,
          yzxh: 1,

        },
      }),
      this.h12_yzxbRepo.find({
        where: {
          zyid: dto.zyid,
          yzlx: dto.yzlx,
          yzxh: In([...dto.yzxh]),
          mxxh: In([...dto.mxxh])
        },
        select: ['kshs', 'hdhs',
          'hshdrq',
          'zyid', 'yzlx', 'yzxh',
          'mxxh', 'hshd',
          'yzzt',
          'hdbz', 'jshs', 'tzrq', 'xmmc']
      }),
    ])

    yzxbList.forEach((yzxb) => {
      // if (yzxb.kshs) {
      //   throw new CustomException(ERR.ERR_10000, '该医嘱已经复核,复核工号：' + yzxb.kshs);
      // }
      // if (yzxb.hshd) {
      //   throw new CustomException(ERR.ERR_10000, '该医嘱已经核对,核对工号：' + yzxb.hshd);
      // }
      yzxb.kshs = dto.kshs
      yzxb.hshd = dto.kshs
      yzxb.hdbz = 1
      yzxb.yzzt = 1
      if (dto.yzlx === 2) {
        yzxb.jshs = dto.jshs
        yzxb.tzrq = dto.rq
      }
      if (dto.yzlx === 1 && yzzb.tzsj) {
        yzxb.jshs = dto.jshs
        yzxb.tzrq = dto.rq
        // yzxb.tzrq = yzzb.tzsj
      }
    })
    await this.h12_yzxbRepo.save(yzxbList)
  }
  //护士执行医嘱
  async execute(dto: executeDto) {
    try {
      let zxbz = '10'
      let { zxhs, zxks, zyid,
        executeType, beginDate, endDate,
        newYear = '', medicine = '', mxxh } = dto

      const [yzzb, yzxbList] = await Promise.all([
        this.h12_yzzbRepo.findOne({
          where: {
            zyid: dto.zyid,
            yzlx: In([1, 2, 7]),
            yzxh: 1,
          },
        }),
        this.h12_yzxbRepo.find({
          where: {
            zyid: dto.zyid,
            yzlx: In([1, 2, 7]),
          },
          select: ['kshs', 'hdhs', 'hshdrq',
            'zyid', 'yzlx', 'yzxh',
            'mxxh', 'hshd',
            'hdbz', 'jshs', 'tzrq', 'xmmc']
        }),
      ])
      if (executeType === '0') {
        executeType = '%'
        const index = yzxbList.findIndex(item => !item.kshs)
        if (index !== -1) {
          const xmmc = yzxbList[index].xmmc
          throw new CustomException(ERR.ERR_10000, `[${xmmc}] 未复核,请先复核医嘱`);
        }
      }
      if (executeType === '101') {
        executeType = String(mxxh)
        zxbz = '9'
      }
      if (executeType === '102') {
        executeType = '%'
        zxbz = '5'
      }
      if (executeType === '103') {
        executeType = '%'
        zxbz = '3'
      }
      await this.dataSource.query(
        `EXEC sp_h13hdzx_zyzx  @zxbz = @0, @li_para = @1, @ls_depart = @2, @ldt_begin = @3,
          @ldt_end = @4, @ls_man = @5, @ls_yzlx = @6`,
        [
          zxbz, zyid, zxks, beginDate, endDate, zxhs, executeType,
        ]
      );
      if (medicine === '1') {
        const syspar_new = await this.syspar_newService.findNewOne('99', 'zyyzfyzxbz')
        if (syspar_new.pval === '1') {
          throw new CustomException(ERR.ERR_10000, '正在执行生成发药，请稍等！');
        }
        await this.syspar_newService.updateNew('99', 'zyyzfyzxbz', '1')
        await this.dataSource.query(
          `EXEC sp_h13zxcs_fyjl  @as_ksid = @0, @li_para = @1, @ls_usid = @2, @yzlx = @3`,
          [
            zxks, zyid, zxhs, 0,
          ]
        );
        await this.syspar_newService.updateNew('99', 'zyyzfyzxbz', '0')
      }
    } catch (error) {
      console.error(error);
      throw new CustomException(ERR.ERR_10000, error.message ?? '执行医嘱失败');
    }
  }
}
