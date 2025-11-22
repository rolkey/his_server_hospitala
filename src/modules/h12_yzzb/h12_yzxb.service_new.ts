import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { h12_yzzb } from './h12_yzzb.entity';
import { h12_yzxb } from './h12_yzxb.entity';
import { GyIdentityService } from '../gy_identity/gy-identity.service';
import { executeDto, removeDto, reviewDto } from './dto/h12_yzzbOpe.dto';
import { CustomException } from '@/common/exceptions/custom.exception';
import { ERR } from '@/common/exceptions/error-code';
import { syspar_newService } from '../syspar_new/syspar_new.service';
import { H13YzzxcsTf } from '../h13_yzzxcs_tf/h13-yzzxcs-tf.entity';
import { h13_yzzxcs } from '../​​h13_yzzxcs​​/h13_yzzxcs.entity';
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
    @InjectRepository(h13_yzzxcs)
    private h13_yzzxcsRepo: Repository<h13_yzzxcs>,
    private readonly gyIdentityService: GyIdentityService,
    private dataSource: DataSource,
    private readonly syspar_newService: syspar_newService,
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
          mxxh: In([...dto.mxxh]),
        },
        select: [
          'kshs',
          'hdhs',
          'hshdrq',
          'zyid',
          'yzlx',
          'yzxh',
          'mxxh',
          'hshd',
          'yzzt',
          'hdbz',
          'jshs',
          'tzrq',
          'xmmc',
        ],
      }),
    ]);

    yzxbList.forEach((yzxb) => {
      // if (yzxb.kshs) {
      //   throw new CustomException(ERR.ERR_10000, '该医嘱已经复核,复核工号：' + yzxb.kshs);
      // }
      // if (yzxb.hshd) {
      //   throw new CustomException(ERR.ERR_10000, '该医嘱已经核对,核对工号：' + yzxb.hshd);
      // }
      yzxb.kshs = dto.kshs;
      yzxb.hshd = dto.kshs;
      yzxb.hdbz = 1;
      yzxb.yzzt = 1;
      if (dto.yzlx === 2) {
        if (!yzxb.tzrq) yzxb.tzrq = dto.rq;
        yzxb.jshs = dto.jshs;
      }
      if (dto.yzlx === 1 && yzzb.tzsj) {
        if (!yzxb.tzrq) yzxb.tzrq = dto.rq;
        yzxb.jshs = dto.jshs;
      }
    });
    await this.h12_yzxbRepo.save(yzxbList);
  }
  //护士执行医嘱
  async execute(dto: executeDto) {

    try {
      let zxbz = '10';
      const
        { zxhs, zxks, zyid, beginDate, endDate, newYear = '', medicine = '', mxxh, } = dto;
      let executeType = dto.executeType
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
          select: [
            'kshs', 'hdhs', 'hshdrq', 'zyid', 'yzlx', 'yzxh', 'mxxh', 'hshd', 'hdbz', 'jshs', 'tzrq', 'xmmc',
          ],
        }),
      ]);
      if (executeType === '0') {
        executeType = '%';
        const index = yzxbList.findIndex((item) => !item.kshs);
        if (index !== -1) {
          const xmmc = yzxbList[index].xmmc;
          throw new CustomException(ERR.ERR_10000, `[${xmmc}] 未复核,请先复核医嘱`);
        }
      }
      if (executeType === '101') {
        executeType = String(mxxh);
        zxbz = '9';
      }
      if (executeType === '102') {
        executeType = '%';
        zxbz = '5';
      }
      if (executeType === '103') {
        executeType = '%';
        zxbz = '3';
      }
      await this.dataSource.query(
        `EXEC sp_h13hdzx_zyzx  @zxbz = @0, @li_para = @1, @ls_depart = @2, @ldt_begin = @3,
          @ldt_end = @4, @ls_man = @5, @ls_yzlx = @6`,
        [zxbz, zyid, zxks, beginDate, endDate, zxhs, executeType],
      );
      if (medicine === '1') {
        const syspar_new = await this.syspar_newService.findNewOne('99', 'zyyzfyzxbz');
        if (syspar_new.pval === '1') {
          throw new CustomException(ERR.ERR_10000, '正在执行生成发药，请稍等！');
        }
        // await this.syspar_newService.updateNew('99', 'zyyzfyzxbz', '1');
        await this.dataSource.query(
          `EXEC sp_h13zxcs_fyjl  @as_ksid = @0, @li_para = @1, @ls_usid = @2, @yzlx = @3`,
          [zxks, zyid, zxhs, 0],
        );
        // await this.syspar_newService.updateNew('99', 'zyyzfyzxbz', '0');
      }
    } catch (error) {
      console.error(error);
      throw new CustomException(ERR.ERR_10000, error.message ?? '执行医嘱失败');
    }
  }

  //删除医嘱费用
  async deleteCost(dto: removeDto) {
    if (!dto.mxxhList.length) {
      return
    }
    await this.dataSource.transaction(async (manager) => {
      try {

        const syspar_new = await this.syspar_newService.findNewOne('99', 'zyyzfyzxbz', manager);

        if (syspar_new.pval === '1') {
          throw new CustomException(ERR.ERR_10000, '正在执行生成发药，请稍等！');
        }

        const h13_yzzxcsRepository = manager.getRepository(h13_yzzxcs)

        const h13_yzzxcsList = await h13_yzzxcsRepository.createQueryBuilder('h13_yzzxcs')
          .leftJoin('h13_yzzxcs.xmidEntity', 'xmidEntity')
          .addSelect(['xmidEntity.xmid', 'xmidEntity.xmmc', 'xmidEntity.ggxh', 'xmidEntity.xmzl'])
          .leftJoin('h13_yzzxcs.H31Lyjl', 'H31Lyjl',)
          .addSelect(['H31Lyjl.djbh', 'H31Lyjl.tjbz', 'H31Lyjl.zyid', 'H31Lyjl.ckclbz', 'H31Lyjl.ksid', 'H31Lyjl.fhksid'])
          .leftJoin('h13_yzzxcs.H13YzzxcsTfList', 'H13YzzxcsTfList')
          .addSelect(['H13YzzxcsTfList.zxcs',
            'H13YzzxcsTfList.yzxh', 'H13YzzxcsTfList.mxxh',
            'H13YzzxcsTfList.fybz', 'H13YzzxcsTfList.fydh',
            'H13YzzxcsTfList.yzlx', 'H13YzzxcsTfList.zyid', 'H13YzzxcsTfList.zxcs2'])
          .where('h13_yzzxcs.zyid = :zyid and h13_yzzxcs.yzlx=:yzlx and h13_yzzxcs.mxxh IN (:...mxxhList)', {
            zyid: dto.zyid,
            yzlx: dto.yzlx || '',
            mxxhList: dto.mxxhList.map(item => item.mxxh),
          }).getMany()


        if (!h13_yzzxcsList.length) {
          return
        }
        h13_yzzxcsList.forEach(item => {

          if (item.bzxcs !== item.zxcs && item.xmidEntity.xmzl !== 1 && item?.H31Lyjl?.ckclbz === 1) {
            throw new CustomException(ERR.ERR_10000, `[${item.xmidEntity.xmmc}] 已发药，请走退费流程!`);
          }
          else if (item.bzxcs !== item.zxcs && item.xmidEntity.xmzl !== 1 && item.fydh) {
            throw new CustomException(ERR.ERR_10000, `[${item.xmidEntity.xmmc}] 已生成领药单，请发药科室退回单号【${item.fydh}】才可以删除!`);
          }

          const H13YzzxcsTfList = item.H13YzzxcsTfList

          const index = H13YzzxcsTfList.findIndex(item => item.fybz === 0)

          if (index !== -1 && item.fydh) {
            throw new CustomException(ERR.ERR_10000, `退药单 [${H13YzzxcsTfList[index].fydh}] 未执行退药`);
          }
          const bzxcs = H13YzzxcsTfList.reduce((val, item) => {
            return item.zxcs + val
          }, 0)

          if (item.zxcs + bzxcs !== 0 && item.fydh) {
            throw new CustomException(ERR.ERR_10000, `单号 [${item.fydh}] 未退完全部执行次数`);
          }

          if (item.bzxcs !== item.zxcs && item.xmidEntity.xmzl === 1 && item.clbz === 1) {
            throw new CustomException(ERR.ERR_10000, `[${item.xmidEntity.xmmc}] 已执行，不能删除`);
          }

        })
        await h13_yzzxcsRepository.delete({
          zyid: dto.zyid,
          yzlx: dto.yzlx,
          mxxh: In(h13_yzzxcsList.map((item) => item.mxxh))
        })
      } catch (error) {
        console.error(error);
        throw new CustomException(ERR.ERR_10000, error.message ?? '删除费用失败');
      }
    });
  }

  //退费医嘱费用
  async refundCost(dto: removeDto) {
    if (!dto.mxxhList.length) {
      return
    }
    await this.dataSource.transaction(async (manager) => {
      try {
        const syspar_new = await this.syspar_newService.findNewOne('99', 'zyyzfyzxbz', manager);

        if (syspar_new.pval === '1') {
          throw new CustomException(ERR.ERR_10000, '正在执行生成发药，请稍等！');
        }

        const h13_yzzxcsRepository = manager.getRepository(h13_yzzxcs)

        const H13YzzxcsTfRepository = manager.getRepository(H13YzzxcsTf)

        const h13_yzzxcsList = await h13_yzzxcsRepository.createQueryBuilder('h13_yzzxcs')
          .leftJoin('h13_yzzxcs.xmidEntity', 'xmidEntity')
          .addSelect(['xmidEntity.xmid', 'xmidEntity.xmmc', 'xmidEntity.ggxh', 'xmidEntity.xmzl'])
          .leftJoin('h13_yzzxcs.H31Lyjl', 'H31Lyjl')
          .addSelect(['H31Lyjl.zyid', 'H31Lyjl.djbh', 'H31Lyjl.tjbz', 'H31Lyjl.ckclbz', 'H31Lyjl.ksid', 'H31Lyjl.fhksid'])
          .where('h13_yzzxcs.zyid = :zyid and h13_yzzxcs.yzlx=:yzlx and h13_yzzxcs.mxxh IN (:...mxxhList)', {
            zyid: dto.zyid,
            yzlx: dto.yzlx || '',
            mxxhList: dto.mxxhList.map(item => item.mxxh),
          }).getMany()

        if (!h13_yzzxcsList.length) {
          return
        }

        let H13YzzxcsTfList: H13YzzxcsTf[] = []

        h13_yzzxcsList.forEach(item => {

          if (item.xmidEntity.xmzl === 1 && item.clbz === 1) {
            throw new CustomException(ERR.ERR_10000, `[${item.xmidEntity.xmmc}] 已执行，不能退费`);
          }
          if (item.xmidEntity.xmzl !== 1 && item?.H31Lyjl?.ckclbz !== 1) {
            throw new CustomException(ERR.ERR_10000, `[${item.xmidEntity.xmmc}] 未发药，请走删除费用流程!`);
          }
          const h13_yzzxcs = dto.mxxhList.find(dtoItem => dtoItem.mxxh === item.mxxh)
          if (h13_yzzxcs.bzxcs > item.zxcs || h13_yzzxcs.bzxcs <= 0) {
            throw new CustomException(ERR.ERR_10000, `[${item.xmidEntity.xmmc}] 不执行次数不能大于执行次数 且不能小于0!`);
          }
          H13YzzxcsTfList.push({
            ...item,
            czrq: new Date(),
            zxrq: new Date(),
            fydh: '',
            zxcs2: item.maxid,
            zxhs: dto.zxhs,
            zxcs: -1 * h13_yzzxcs.bzxcs,
            bzxcs: 0,
            tyrid: dto.zxhs,
            tysj: new Date(),
            sysj: null,
            clbz: 0,
            fybz: 0,
          })
          item.bzxcs = h13_yzzxcs.bzxcs
          item.H31Lyjl = undefined
          item.H13YzzxcsTfList = undefined
        })

        await Promise.all([
          h13_yzzxcsRepository.save(h13_yzzxcsList),
          H13YzzxcsTfRepository.save(H13YzzxcsTfList)
        ])
        await manager.query(
          `EXEC sp_h13zxcs_fyjl  @as_ksid = @0, @li_para = @1, @ls_usid = @2, @yzlx = @3`,
          ['', dto.zyid, dto.zxhs, 0],
        );
      } catch (error) {
        console.error(error);
        throw new CustomException(ERR.ERR_10000, error.message ?? '删除费用失败');
      }
    });
  }
}
