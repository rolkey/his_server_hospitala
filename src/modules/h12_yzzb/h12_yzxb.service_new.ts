import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs = require('dayjs');
import {
  DataSource,
  In,
  Like,
  Repository,
  MoreThan,
  LessThan,
  EntityManager,
  Raw,
  Not,
  IsNull,
} from 'typeorm';
import { h12_yzzb } from './h12_yzzb.entity';
import { h12_yzxb } from './h12_yzxb.entity';
import { GyIdentityService } from '../gy_identity/gy-identity.service';
import {
  executeDto,
  adviceDto,
  reviewDto,
  outDto,
  checkOutDto,
  CopyAdviceDto,
  medicineReceiptDto,
  costDto,
} from './dto/h12_yzzbOpe.dto';
import { CustomException } from '@/common/exceptions/custom.exception';
import { ERR } from '@/common/exceptions/error-code';
import { syspar_newService } from '../syspar_new/syspar_new.service';
import { H13YzzxcsTf } from '../h13_yzzxcs_tf/h13-yzzxcs-tf.entity';
import { h13_yzzxcs } from '../​​h13_yzzxcs​​/h13_yzzxcs.entity';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';
import { h13_cwsyxx } from '../h13_cwsyxx/h13_cwsyxx.entity';
import { H31Lyjl } from '../h31_lyjl/h31_lyjl.entity';
import { ConfigReaderService } from '../h12_xmzd/service/config-reader.service';
import { h12_yzxbService } from './h12_yzxb.service';
import { h00_syffService } from '../h00_syff/h00_syff.service';
import { availableParallelism } from 'os';
import { OutResponse, createSuccessResponse, createErrorResponse } from './dto/out-response.dto';
import { usrcat } from '../usrcat/usrcat.entity';
import { ParamService } from '../h12_xmzd/service/param.service';
import DateFormater from '@/utils/DateFormater';

import { log } from 'console';
import { C00Fbxx } from '../c00_fbxx/c00_fbxx.entity';
import { H13YzzxcsDelete } from '../h13_yzzxcs_delete/h13-yzzxcs-delete.entity';
import { h13_yzzxcsService } from '../​​h13_yzzxcs​​/h13_yzzxcs.service';

/**
 * 完整重构版 Service
 * 重构目标：
 * - 提高可读性，将魔法字抽成常量/枚举
 * - 更一致的日志记录（使用 Nest Logger）
 * - 更好的事务与并发控制示例（syspar 标志的原子设置/释放）
 * - 将重复逻辑拆分为私有 helper 方法
 * - 保持对原有行为的兼容（尽量不改变存储过程调用）
 */

const DEFAULT_ZXBZ = '10';
const EXECUTE_TYPE_WILDCARD = '%';
/**
 * 护士执行医嘱
 * 0.全部
 * 2.临时医嘱
 * 5.长期处置
 * 7.临时处置
 * 102.中药医嘱
 * 103.自动项目
 * 104 已选择的组
 */
enum Zxbz {
  DEFAULT = '10', // 默认情况
  WITH_GROUP = '9', //同组
  CHINESE_MEDICINE = '5', //中药执行
  AUTO_ITEMS = '3', //自动项目
}

@Injectable()
export class h12_yzxbServiceNew {
  private readonly logger = new Logger(h12_yzxbServiceNew.name);
  private readonly SYSPAR_KEY = { type: '99', key: 'zyyzfyzxbz' };

  constructor(
    @InjectRepository(h12_yzzb)
    private h12_yzzbRepo: Repository<h12_yzzb>,
    @InjectRepository(h12_yzxb)
    private h12_yzxbRepo: Repository<h12_yzxb>,
    @InjectRepository(h13_yzzxcs)
    private h13_yzzxcsRepo: Repository<h13_yzzxcs>,
    @InjectRepository(h11_brxx)
    private h11BrxxRepo: Repository<h11_brxx>,
    @InjectRepository(h13_cwsyxx)
    private h13_cwsyxxRepo: Repository<h13_cwsyxx>,
    @InjectRepository(C00Fbxx)
    private c00FbxxRepo: Repository<C00Fbxx>,
    @InjectRepository(usrcat)
    private usrcatRepo: Repository<usrcat>,
    // @InjectRepository(H31Lyjl)
    // private h31LyjlRepo: Repository<H31Lyjl>,
    private readonly gyIdentityService: GyIdentityService,
    private dataSource: DataSource,
    private readonly syspar_newService: syspar_newService,
    private readonly configReaderService: ConfigReaderService,
    private readonly paramService: ParamService,
    private readonly h12_yzxbOldService: h12_yzxbService,
    private readonly h00syffService: h00_syffService,
    private readonly entityManager: EntityManager,
    private readonly h13YzzxcsService: h13_yzzxcsService,
  ) {}

  // -------------------------
  // 复核医嘱
  // -------------------------
  async review(dto: reviewDto): Promise<void> {
    try {
      const [yzzb, yzxbList, yzhshdbz, yzauton] = await Promise.all([
        this.h12_yzzbRepo.findOne({
          where: { zyid: dto.zyid, yzlx: dto.yzlx, yzxh: 1 },
        }),
        this.h12_yzxbRepo.find({
          where: {
            zyid: dto.zyid,
            yzlx: dto.yzlx,
            ...(dto.yzxh && dto.yzxh.length > 0 ? { yzxh: In(dto.yzxh) } : {}),
            ...(dto.mxxh && dto.mxxh.length > 0 ? { mxxh: In(dto.mxxh) } : {}),
            hdbz: In([0, 1, null]),
            ysbz: 1,
            tjbz: 1,
            yzzt: In([1, 5]), // 只复核：提交/待核停嘱
          },
          relations: ['h13_yzzxcsList'],
        }),
        this.paramService.gfGetParaNew(13, 'yzhshdbz', '1', '启用复核医嘱同时校对(1是，0否)'),
        this.paramService.gfGetPara(99, 'yzauton', '0', 'yzauton'), //医嘱自动复核增加附加项目
      ]);

      const deleteYzzxcss = [];
      const updateYzzxcss = [];
      const tfListToInsertAll: H13YzzxcsTf[] = []; // 退费记录
      const filterError = [];
      const allYzxbs = yzxbList.filter(async (yzxb) => {
        if (yzxb.h13_yzzxcsList) {
          // 逻辑：dto.hlfy为true时过滤掉还有费用的医嘱
          // 默认情况下，未执行的超出执行时间的费用需要删除

          // 执行日期大于等于停嘱日期，要进行相应处理
          const tzrq = new Date(yzxb.tzrq);
          tzrq.setHours(0, 0, 0, 0); // 去掉时分秒

          const h13YzzxcsItem = yzxb.h13_yzzxcsList.filter((item) => {
            // 检查是否存在未处理的费用记录

            //  如果则放入删除数组deleteYzzxcss
            if (item.zxrq > tzrq && item.zxcs - item.bzxcs > 0) {
              if (item.clbz === 1 || item.fydh) {
                // todo: 已经处理处理，要生成退费单
                const costDtoValue = {
                  mxxh: item.mxxh,
                  maxid: item.maxid,
                  bzxcs: item.zxcs,
                };
                const tfListToInsert: H13YzzxcsTf[] = this.createRefundList(
                  [item],
                  [costDtoValue],
                  {
                    zyid: dto.zyid,
                    yzlx: dto.yzlx,
                    zxhs: dto.jshs,
                  },
                );
                tfListToInsertAll.push(...tfListToInsert);
              } else {
                // 没有处理可以直接删除
                deleteYzzxcss.push(item);
              }
            } else if (item.zxrq.getTime() === tzrq.getTime()) {
              if (item.clbz === 1 || item.fydh) {
                if (item.zxcs - item.bzxcs - yzxb.mrcs > 0) {
                  // 生成部分退费记录
                  const costDtoValue = {
                    mxxh: item.mxxh,
                    maxid: item.maxid,
                    bzxcs: item.zxcs - item.bzxcs - yzxb.mrcs,
                  };
                  const tfListToInsert: H13YzzxcsTf[] = this.createRefundList(
                    [item],
                    [costDtoValue],
                    {
                      zyid: dto.zyid,
                      yzlx: dto.yzlx,
                      zxhs: dto.jshs,
                    },
                  );
                  tfListToInsertAll.push(...tfListToInsert);
                }
              } else {
                item.zxcs = yzxb.mrcs;
                updateYzzxcss.push(item);
              }
            }

            if (
              (item.clbz === 1 || item.fydh) &&
              item.zxrq >= tzrq &&
              item.zxcs - item.bzxcs - yzxb.mrcs > 0 // 检查数量时要考虑末日次数
            ) {
              if (dto.hlfy) return true;
              else {
                filterError.push('仍有未退费医嘱，复核失败！！');
                return false;
              }
            } else return false;
          });
          return h13YzzxcsItem.length === 0;
        } else return true;
      });

      if (filterError.length > 0) {
        throw new BadRequestException(filterError.join(','));
      }

      // 转换日期
      const dtoZXRQ = new Date(dto.rq);
      const formatZXRQ = dtoZXRQ.getFullYear() + '-' + dtoZXRQ.getMonth() + '-' + dtoZXRQ.getDate();
      // 附加信息
      const yzxbFJList: h12_yzxb[] = [];
      // 批量修改并保存
      await Promise.all(
        allYzxbs.map(async (yzxb) => {
          //yzxbList.forEach(async (yzxb) => {
          const ksrq = new Date(yzxb.ksrq);
          let zzrq = new Date(yzxb.tzrq);
          const formatKSRQ = ksrq.getFullYear() + '-' + ksrq.getMonth() + '-' + ksrq.getDate();
          if (!yzxb.kshs) {
            //日期不在同一天
            if (formatZXRQ != formatKSRQ || ksrq < dtoZXRQ) {
              zzrq = dtoZXRQ;
              zzrq.setSeconds(300);
            }
            yzxb.kshs = dto.kshs;
            yzxb.hshd = dto.kshs;
            yzxb.hshdrq = zzrq;

            // 复核同时校验
            if (yzhshdbz == '1') {
              yzxb.hdhs = dto.kshs;
              yzxb.hshdrq = zzrq;
            }

            // 临时医嘱、临时处置处理
            if (yzxb.yzlx === 2 || yzxb.yzlx === 7) {
              yzxb.jshs = dto.jshs;
              yzxb.tzrq = zzrq;
            }
          }

          // 实习护士
          if (!yzxb.kssxhs && !yzxb.kshs) {
            yzxb.kssxhs = dto.kssxhs;
          }

          // 临时医嘱、临时处置处理
          if (!zzrq && (yzxb.yzlx === 2 || yzxb.yzlx === 7)) {
            // 日期处理
            if (formatZXRQ != formatKSRQ || ksrq < dtoZXRQ) {
              zzrq = ksrq;
              zzrq.setSeconds(300);
            } else {
              zzrq = dtoZXRQ;
            }
            yzxb.tzrq = zzrq;

            // 停嘱护士处理
            if (!yzxb.jshs) {
              yzxb.jshs = dto.jshs;
            }
          }

          if (yzxb.jsys && !yzxb.jshs) {
            yzxb.jshs = dto.kshs;
          }

          if (yzxb.jsys || yzxb.jssxys) {
            if (!yzxb.jshs && !yzxb.jssxhs && dto.kshs && dto.kssxhs) {
              yzxb.jshs = dto.kshs;
              yzxb.jssxhs = dto.kssxhs;
            } else if (!yzxb.jshs && dto.kshs) {
              yzxb.jshs = dto.kshs;
            } else if (!yzxb.jshs && dto.kssxhs) {
              yzxb.jssxhs = dto.kssxhs;
            }
          }
          yzxb.hdbz = 1;
          // 状态：1提交-->2复核，5待核停嘱-->6停嘱
          yzxb.yzzt = yzxb.yzzt === 1 ? 2 : yzxb.yzzt === 5 ? 6 : yzxb.yzzt;
          if (yzxb.xmdj == 0) {
            yzxb.zxbz = 1;
          }

          //查询附加
          const yzxbFJ = await this.h12_yzxbRepo.find({
            where: {
              zyid: dto.zyid,
              yzlx: dto.yzlx,
              yzxh: yzxb.yzxh,
              yzzh: yzxb.yzzh, // 大于0
              ysbz: 0,
            },
          });

          // 复核附加
          if (yzxbFJ.length > 0) {
            yzxbFJ.forEach((yzxbFJItem) => {
              yzxbFJItem.hdbz = 1;
              yzxbFJItem.yzzt = 2; // 已复核
              yzxbFJItem.kshs = dto.kshs;
              if (yzxbFJItem.yzlx === 2) {
                yzxbFJItem.tzrq = yzxb.tzrq;
              }
              // 复核停嘱附加
              if (
                (yzxb.tpbz == 1 && (yzxb.yzlx == 2 || yzxb.yzlx == 5) && yzxb.jsys && !yzxb.jshs) ||
                yzauton == '1'
              ) {
                if (yzxbFJItem.tzbz == 1) {
                } else {
                  yzxbFJItem.tzbz = yzxb.tzbz;
                  yzxbFJItem.jsnf = yzxb.jsnf;
                  yzxbFJItem.mrcs = yzxb.mrcs;
                  yzxbFJItem.tzrq = yzxb.tzrq;
                }
                yzxbFJItem.jsys = yzxb.jsys;
                yzxbFJItem.jshs = yzxb.jshs;
              }

              yzxbFJList.push(yzxbFJItem);
            });
          }

          // 自动附加项目？
          if (yzxb.tpbz == 1 || yzxb.tpbz == 2 || yzxb.yzzh == 0 || yzauton == '0') {
          } else {
            if (yzxbFJ.length <= 0 && yzxb.syffid) {
              const syffItem = await this.h00syffService.findOne(yzxb.syffid);
              let mbid = '';
              // xmid1 1:全院 2:科室
              if (syffItem.xmid1 === '2') {
                mbid = syffItem.xmid || '';
              } else {
                mbid = syffItem.xmid || '';
              }

              if (mbid) {
                const fjxx = await this.h12_yzxbOldService.getPackageItems({
                  advice: yzxb,
                  mbid: mbid,
                  recursionDepth: 1,
                });
                yzxbFJList.push(...fjxx);
              }
            }
          }
        }),
      );

      await this.entityManager.transaction(async (transactionalEntityManager) => {
        const promisses = [];
        if (deleteYzzxcss.length > 0) {
          promisses.push(transactionalEntityManager.remove(deleteYzzxcss));
        }
        if (updateYzzxcss.length > 0) {
          promisses.push(transactionalEntityManager.save(updateYzzxcss));
        }
        if (allYzxbs.length > 0) {
          promisses.push(transactionalEntityManager.save(allYzxbs));
        }
        if (yzxbFJList.length > 0) {
          promisses.push(transactionalEntityManager.save(yzxbFJList));
        }
        if (promisses.length > 0) {
          await Promise.all(promisses);
        }
      });
      // if (yzxbList.length) await this.h12_yzxbRepo.save(yzxbList);
      // if (yzxbFJList.length) await this.h12_yzxbRepo.save(yzxbFJList);
    } catch (error: any) {
      this.logger.error('复核医嘱失败', error);
      throw new CustomException(ERR.ERR_10000, error?.message ?? '复核医嘱失败');
    }
  }

  /**
   * 护士执行医嘱
   *
   * @param dto 执行参数
   *    executeType： 0.全部
   *                  2.临时医嘱
   *                  5.长期处置
   *                  7.临时处置
   *                  102.中药医嘱
   *                  103.自动项目
   *                  104 已选择的组
   */
  async execute(dto: executeDto): Promise<void> {
    let lockAcquired = false;
    try {
      // 参数解构与校验
      const { zxhs, zxks, zyid, beginDate, endDate, newYear = '', medicine = '', yzzh } = dto;

      if (!zyid) throw new CustomException(ERR.ERR_10000, '缺少住院ID');

      const executeType: string | number | [] = dto.executeType;
      let zxbz = Zxbz.DEFAULT;
      let yzlx: number | string;

      // 加载必要的数据用于校验
      if (executeType === '0') {
        yzlx = '%';
      } else if (executeType === '2') {
        yzlx = '2';
      } else if (executeType === '5') {
        yzlx = '5';
      } else if (executeType === '7') {
        yzlx = '7';
      } else if (executeType === '102') {
        yzlx = '%';
        zxbz = Zxbz.CHINESE_MEDICINE;
      } else if (executeType === '103') {
        yzlx = '%';
        zxbz = Zxbz.AUTO_ITEMS;
      }
      if (executeType === '104') {
        zxbz = Zxbz.WITH_GROUP;
        for (const yzzhItem of dto.yzzh.split(',')) {
          // 执行存储过程
          await this.dataSource.query(
            `EXEC sp_h13hdzx_zyzx_dg  @zxbz = @0, @li_para = @1, @ls_depart = @2, @ldt_begin = @3,
                @ldt_end = @4, @ls_man = @5, @ls_yzlx = @6`,
            [zxbz, zyid, zxks, beginDate, endDate, zxhs, yzzhItem],
          );
        }
      } else {
        // 执行存储过程
        await this.dataSource.query(
          `EXEC sp_h13hdzx_zyzx  @zxbz = @0, @li_para = @1, @ls_depart = @2, @ldt_begin = @3,
          @ldt_end = @4, @ls_man = @5, @ls_yzlx = @6`,
          [zxbz, zyid, zxks, beginDate, endDate, zxhs, yzlx],
        );
      }

      // 如果需要生成发药记录，检查并设置并发标志（示例）
      if (medicine === '1') {
        // 尝试加锁（使用 service 的 manager 版本以支持事务，如果你的 syspar_newService 支持 manager 传参）
        const syspar = await this.syspar_newService.findNewOne(
          this.SYSPAR_KEY.type,
          this.SYSPAR_KEY.key,
        );
        if (syspar?.pval === '1') {
          throw new CustomException(ERR.ERR_10000, '正在执行生成发药，请稍等！');
        }

        // 建议：原子设置标志位（依赖 syspar_newService.updateNew 的实现能在同一事务中工作）
        // 下面示例仅做逻辑演示：设置标志 -> 调用存储过程 -> 清除标志
        try {
          lockAcquired = await this.tryAcquireSysparLock();

          await this.dataSource.query(
            `EXEC sp_h13zxcs_fyjl  @as_ksid = @0, @li_para = @1, @ls_usid = @2, @yzlx = @3`,
            [zxks, zyid, zxhs, 0],
          );
        } finally {
          if (lockAcquired)
            await this.releaseSysparLock().catch((e) => this.logger.warn('释放syspar锁失败', e));
        }
      }

      const c00FbxxList = await this.c00FbxxRepo.find({
        where: {
          fksid: zxks,
          //   sksid: Like('%'),
          zyid,
        },
      });
      if (c00FbxxList && c00FbxxList.length > 0) {
        throw new CustomException(
          ERR.ERR_40001,
          '有药品缺药，不能执行，请退回医生或提醒医生停嘱重开！',
          undefined,
          c00FbxxList,
        );
      }
    } catch (error: any) {
      this.logger.error('执行医嘱失败', error);
      throw new CustomException(
        error ?? ERR.ERR_40002,
        error?.message ?? ERR.ERR_40002.message,
        null,
        error.data,
      );
    }
  }

  // -------------------------
  // 删除医嘱费用
  // -------------------------
  async deleteCost(dto: adviceDto): Promise<void> {
    if (!dto?.mxxhList?.length) throw new CustomException(ERR.ERR_40807);

    const maxidList = dto.mxxhList.map((it) => it.maxid).filter(Boolean);
    if (!maxidList.length) throw new CustomException(ERR.ERR_40808);

    await this.dataSource.transaction(async (manager) => {
      try {
        // 并发标志检查（使用 manager 版的查找，以保证校验在事务内）
        const syspar_new = await this.syspar_newService.findNewOne(
          this.SYSPAR_KEY.type,
          this.SYSPAR_KEY.key,
          manager,
        );
        if (syspar_new?.pval === '1') {
          throw new CustomException(ERR.ERR_40801);
        }

        const h13Repo = manager.getRepository(h13_yzzxcs);

        const h13_yzzxcsList = await h13Repo
          .createQueryBuilder('h13_yzzxcs')
          .leftJoin('h13_yzzxcs.xmidEntity', 'xmidEntity')
          .addSelect(['xmidEntity.xmid', 'xmidEntity.xmmc', 'xmidEntity.ggxh', 'xmidEntity.xmzl'])
          .leftJoin('h13_yzzxcs.h12_yzxb', 'h12_yzxb')
          .addSelect(['h12_yzxb.xmzl', 'h12_yzxb.xmmc'])
          .leftJoin('h13_yzzxcs.h31Lyjl', 'h31Lyjl')
          .addSelect([
            'h31Lyjl.djbh',
            'h31Lyjl.tjbz',
            'h31Lyjl.zyid',
            'h31Lyjl.ckclbz',
            'h31Lyjl.ksid',
            'h31Lyjl.fhksid',
          ])
          .leftJoin('h13_yzzxcs.h13YzzxcsTfList', 'H13YzzxcsTfList')
          .addSelect([
            'H13YzzxcsTfList.zxcs',
            'H13YzzxcsTfList.yzxh',
            'H13YzzxcsTfList.mxxh',
            'H13YzzxcsTfList.fybz',
            'H13YzzxcsTfList.fydh',
            'H13YzzxcsTfList.yzlx',
            'H13YzzxcsTfList.zyid',
            'H13YzzxcsTfList.maxid',
            'H13YzzxcsTfList.zxcs2',
          ])
          .where(
            'h13_yzzxcs.zyid = :zyid and h13_yzzxcs.yzlx=:yzlx and h13_yzzxcs.maxid IN (:...maxidList)',
            {
              zyid: dto.zyid,
              yzlx: dto.yzlx || '',
              maxidList: maxidList,
            },
          )
          .getMany();

        if (!h13_yzzxcsList.length) return;

        const h13_yzzxcs_tfs = [];
        const h13_yzzxcs_tf_maxids = [];

        // 校验业务规则
        for (const item of h13_yzzxcsList) {
          const xmzl = item.xmidEntity?.xmzl || item.h12_yzxb.xmzl;
          const xmmc = item.xmidEntity?.xmmc || item.h12_yzxb.xmmc;
          const H13YzzxcsTfList = item.h13YzzxcsTfList ?? [];

          if (item.bzxcs !== item.zxcs && xmzl !== 1 && item?.h31Lyjl?.ckclbz === 1) {
            throw new CustomException(
              ERR.ERR_40802,
              `[${item.xmidEntity.xmmc}] 已发药，请走退费流程!`,
            );
          }
          if (item.bzxcs !== item.zxcs && xmzl !== 1 && item.fydh) {
            throw new CustomException(
              ERR.ERR_40803,
              `[${item.xmidEntity.xmmc}] 已生成领药单，请退回单号【${item.fydh}】才可以删除!`,
            );
          }

          const index = H13YzzxcsTfList.findIndex((tf) => tf.fybz === 0);
          if (index !== -1 && item.fydh) {
            throw new CustomException(
              ERR.ERR_40804,
              `退药单 [${H13YzzxcsTfList[index].fydh}] 未执行发药！！`,
            );
          }

          const bzxcs = H13YzzxcsTfList.reduce((val, tf) => val + (tf.zxcs ?? 0), 0);
          if (item.zxcs + bzxcs !== 0 && item.fydh) {
            throw new CustomException(ERR.ERR_40805, `单号 [${item.fydh}] 未退完全部执行次数`);
          }
          for (const yzzxcsTf of item.h13YzzxcsTfList) {
            // yzzxcsTf.yzxh = item.yzxh;
            // yzzxcsTf.zxrq = item.zxrq;
            if (!(yzzxcsTf.clbz === 1 || yzzxcsTf.fydh)) {
              h13_yzzxcs_tf_maxids.push(yzzxcsTf.maxid);
              delete yzzxcsTf.maxid;
            }
          }
          //   h13_yzzxcs_tfs.push(...item.h13YzzxcsTfList);
          //   item.zxcs2 = item.maxid;
          //   delete item.maxid;

          if (item.bzxcs !== item.zxcs && xmzl === 1 && item.clbz === 1) {
            throw new CustomException(ERR.ERR_40806, `[${xmmc}] 已执行，不能删除`);
          }
        }

        // 把退费表保存到h13_yzzxcs_delete表中，并删除退费记录
        await manager.save(H13YzzxcsDelete, h13_yzzxcs_tfs);
        await manager.delete(H13YzzxcsTf, {
          zyid: dto.zyid,
          maxid: In(h13_yzzxcs_tf_maxids),
        });
        // 删除退费记录
        await manager.save(H13YzzxcsDelete, h13_yzzxcsList);
        // 删除费用
        await manager.delete(h13_yzzxcs, {
          zyid: dto.zyid,
          yzlx: dto.yzlx,
          maxid: In(maxidList),
        });

        //如果有领药记录 则把相对应的item.H31Lyjl里所有记录的ckclbz重置为0
        // const H31LyjlRepo = manager.getRepository(H31Lyjl);
        // for (const item of h13_yzzxcsList) {
        //   if (item?.h31Lyjl) {
        //     const lyjlList = await H31LyjlRepo.find({
        //       where: {
        //         ksid: item.h31Lyjl.ksid,
        //         djlb: item.h31Lyjl.djlb,
        //         djbh: item.h31Lyjl.djbh,
        //       },
        //     });
        //     if (lyjlList.length > 0) {
        //       for (const lyjl of lyjlList) {
        //         //调整相对应h31_lyjl表里的相应记录的ckclbz为0
        //         if (lyjl.ckclbz !== 1) {
        //           lyjl.ckclbz = 0;
        //           await H31LyjlRepo.save(lyjl);
        //         }
        //       }
        //     }
        //   }
        // }

        // 功能：检查如果同组费用已经全部清除，则修改医嘱状态
        const h12Repo = manager.getRepository(h12_yzxb);
        const yzxbs = await h12Repo.find({
          where: {
            zyid: dto.zyid,
            yzlx: dto.yzlx,
            yzzh: In(h13_yzzxcsList.map((it) => it.yzzh)),
          },
          relations: {
            h13_yzzxcsList: true, // 显式加载关联数据
          },
          select: {
            // 选择 h12 表中的字段
            zyid: true,
            yzlx: true,
            yzxh: true,
            mxxh: true,
            yzzt: true,
            // 添加其他你需要的字段
            h13_yzzxcsList: {
              // 选择关联表 h13_yzzxcs 中的字段
              mxxh: true,
              // 添加其他你需要的字段
            },
          },
        });

        // 2. 按yzzh分组
        const groupedByYzzh = yzxbs.reduce(
          (acc, yzxb) => {
            if (!acc[yzxb.yzzh]) {
              acc[yzxb.yzzh] = [];
            }
            acc[yzxb.yzzh].push(yzxb);
            return acc;
          },
          {} as Record<string, typeof yzxbs>,
        );

        // 3. 找出所有h13_yzzxcsList都为空的yzzh组
        const emptyGroups = Object.entries(groupedByYzzh).filter(([, group]) =>
          group.every((yzxb) => !yzxb.h13_yzzxcsList?.length),
        );

        // 4. 准备需要更新的记录
        const yzxbUpdate = emptyGroups.flatMap(([, group]) => group);

        // 5. 如果有需要更新的记录，进行更新
        if (yzxbUpdate.length > 0) {
          yzxbUpdate.forEach((yzxbup) => {
            if ([3, 4].includes(yzxbup.yzzt)) {
              yzxbup.yzzt = 2;
            }
            if (yzxbup.zxbz) {
              yzxbup.zxbz = 0;
            }
          });

          await h12Repo.save(yzxbUpdate);
        }
      } catch (error: any) {
        console.error('删除费用出错：', error);
        if (error instanceof CustomException) {
          throw error;
        } else throw new CustomException(ERR.ERR_40810);
      }
    });
  }

  // -------------------------
  // 退费医嘱费用（旧）
  // -------------------------
  // async refundCost(dto: adviceDto): Promise<void> {
  //   if (!dto?.mxxhList?.length) return;

  //   const mxxhArray = dto.mxxhList.map((it) => it.mxxh).filter(Boolean);
  //   if (!mxxhArray.length) return;

  //   await this.dataSource.transaction(async (manager) => {
  //     try {
  //       const syspar_new = await this.syspar_newService.findNewOne(this.SYSPAR_KEY.type, this.SYSPAR_KEY.key, manager);
  //       if (syspar_new?.pval === '1') {
  //         throw new CustomException(ERR.ERR_10000, '正在执行生成发药，请稍等！');
  //       }

  //       const h13Repo = manager.getRepository(h13_yzzxcs);
  //       const H13YzzxcsTfRepo = manager.getRepository(H13YzzxcsTf);

  //       const h13_yzzxcsList = await h13Repo.createQueryBuilder('h13_yzzxcs')
  //         .leftJoin('h13_yzzxcs.xmidEntity', 'xmidEntity')
  //         .addSelect(['xmidEntity.xmid', 'xmidEntity.xmmc', 'xmidEntity.ggxh', 'xmidEntity.xmzl'])
  //         .leftJoin('h13_yzzxcs.H31Lyjl', 'H31Lyjl')
  //         .addSelect(['H31Lyjl.zyid', 'H31Lyjl.djbh', 'H31Lyjl.tjbz', 'H31Lyjl.ckclbz', 'H31Lyjl.ksid', 'H31Lyjl.fhksid'])
  //         .where('h13_yzzxcs.zyid = :zyid and h13_yzzxcs.yzlx=:yzlx and h13_yzzxcs.mxxh IN (:...mxxhList)', {
  //           zyid: dto.zyid,
  //           yzlx: dto.yzlx || '',
  //           mxxhList: mxxhArray,
  //         }).getMany();

  //       if (!h13_yzzxcsList.length) return;

  //       const tfListToInsert: H13YzzxcsTf[] = [];

  //       for (const item of h13_yzzxcsList) {
  //         if (item.xmidEntity.xmzl === 1 && item.clbz === 1) {
  //           throw new CustomException(ERR.ERR_10000, `[${item.xmidEntity.xmmc}] 已执行，不能退费`);
  //         }
  //         if (item.xmidEntity.xmzl !== 1 && item?.H31Lyjl?.ckclbz !== 1) {
  //           throw new CustomException(
  //             ERR.ERR_10000,
  //             `[${item.xmidEntity.xmmc}] 未发药，请走删除费用流程!`,
  //           );
  //         }

  //         const dtoItem = dto.mxxhList.find((d) => d.mxxh === item.mxxh);
  //         if (!dtoItem) throw new CustomException(ERR.ERR_10000, '请求参数与数据库数据不匹配');

  //         if (dtoItem.bzxcs > item.zxcs || dtoItem.bzxcs <= 0) {
  //           throw new CustomException(ERR.ERR_10000, `[${item.xmidEntity.xmmc}] 不执行次数不能大于执行次数 且不能小于0!`);
  //         }

  //         tfListToInsert.push({
  //           ...item,
  //           czrq: new Date(),
  //           zxrq: new Date(),
  //           fydh: '',
  //           zxcs2: item.maxid,
  //           zxhs: dto.zxhs,
  //           zxcs: -1 * dtoItem.bzxcs,
  //           bzxcs: 0,
  //           tyrid: dto.zxhs,
  //           tysj: new Date(),
  //           sysj: null,
  //           clbz: 0,
  //           fybz: 0,
  //         } as any);

  //         // 修改主记录的已退次数
  //         item.bzxcs = dtoItem.bzxcs;
  //         item.H31Lyjl = undefined as any;
  //         item.H13YzzxcsTfList = undefined as any;

  //         // 如果有领药记录 则把相对应的item.H31Lyjl里所有记录的ckclbz重置为0
  //         const H31LyjlRepo = manager.getRepository(H31Lyjl);
  //         if (item?.H31Lyjl) {
  //           const lyjlList = await H31LyjlRepo.find({
  //             where: {
  //               ksid: item.H31Lyjl.ksid,
  //               djlb: item.H31Lyjl.djlb,
  //               djbh: item.H31Lyjl.djbh
  //             }
  //           });
  //           if (lyjlList.length > 0) {
  //             for (const lyjl of lyjlList) {
  //               //调整相对应h31_lyjl表里的相应记录的ckclbz为0
  //               lyjl.ckclbz = 0;
  //             }
  //             await H31LyjlRepo.save(lyjlList);
  //           }
  //         }

  //       }

  //       await Promise.all([
  //         h13Repo.save(h13_yzzxcsList),
  //         H13YzzxcsTfRepo.save(tfListToInsert),
  //       ]);

  //       // 调用发药记录的存储过程生成退费单
  //       await manager.query(
  //         `EXEC sp_h13zxcs_fyjl  @as_ksid = @0, @li_para = @1, @ls_usid = @2, @yzlx = @3`,
  //         ['', dto.zyid, dto.zxhs, 0],
  //       );
  //     } catch (error: any) {
  //       this.logger.error('退费失败', error?.stack ?? error?.message ?? error);
  //       throw new CustomException(ERR.ERR_10000, error?.message ?? '删除费用失败');
  //     }
  //   });
  // }

  /**
   * 取消领药单
   * @param dto 取消领药
   */
  async refundMedicineReceipt(dto: adviceDto): Promise<void> {
    try {
      const maxidList = dto.maxidList.map((it) => it.maxid).filter(Boolean);
      const h13_yzzxcsList = await this.h13_yzzxcsRepo.find({
        where: {
          zyid: dto.zyid,
          yzlx: dto.yzlx,
          maxid: In(maxidList),
          fydh: Not(IsNull()),
        },
      });

      // 分组原则：同一个病人/领药单/执行科室(ksid)相同
      const fydhList = [];
      for (const h13_yzzxcs of h13_yzzxcsList) {
        if (h13_yzzxcs.clbz === 1) {
          throw new CustomException(ERR.ERR_40809);
        }
        if (
          !fydhList.find(
            (item) =>
              item.djbh === h13_yzzxcs.fydh &&
              item.ksid === h13_yzzxcs.ksid &&
              item.zyid === h13_yzzxcs.zyid,
          )
        ) {
          fydhList.push({ djbh: h13_yzzxcs.fydh, zyid: h13_yzzxcs.zyid, ksid: h13_yzzxcs.ksid });
        }
      }

      await this.dataSource.transaction(async (manager) => {
        const promisses = [];
        for (const fydh of fydhList) {
          promisses.push(
            manager.update(
              h13_yzzxcs,
              {
                zyid: fydh.zyid,
                ksid: fydh.ksid,
                fydh: fydh.djbh,
              },
              {
                fydh: null,
              },
            ),
          );
          promisses.push(
            manager.update(
              H31Lyjl,
              {
                zyid: fydh.zyid,
                ksid: fydh.ksid,
                djbh: fydh.djbh,
              },
              {
                tjbz: 0,
                bz1: dto.zxhs,
                ckclbz: 1,
              },
            ),
          );
        }
        await Promise.all(promisses);
      });
    } catch (error: any) {
      this.logger.error('取消领药失败！！', error);
      throw new CustomException(ERR.ERR_10000, error?.message ?? '生成发药单失败');
    }
  }

  // -------------------------
  // 退费医嘱费用
  // -------------------------
  async refundCost(dto: adviceDto): Promise<void> {
    if (!dto?.maxidList?.length) return;

    // 兼容前端传入的两种格式：数字数组或包含maxid属性的对象数组
    const maxidList = dto.maxidList
      .map((item) => {
        if (typeof item === 'object' && item !== null && 'maxid' in item) {
          return item.maxid;
        }
        return Number(item);
      })
      .filter((maxid) => !isNaN(maxid));

    if (!maxidList.length) return;

    await this.dataSource.transaction(async (manager) => {
      try {
        // 检查系统参数：住院医嘱生成发药状态(0未执行,1正在执行)
        const syspar_new = await this.syspar_newService.findNewOne('99', 'zyyzfyzxbz', manager);
        if (syspar_new?.pval === '1') {
          throw new CustomException(ERR.ERR_10000, '正在执行生成发药，请稍等！');
        }

        const h13Repo = manager.getRepository(h13_yzzxcs);
        const H13YzzxcsTfRepo = manager.getRepository(H13YzzxcsTf);
        // const H31LyjlRepo = manager.getRepository(H31Lyjl);

        // 查询需要退费的费用记录
        const h13_yzzxcsList = await h13Repo
          .createQueryBuilder('h13_yzzxcs')
          .leftJoin('h13_yzzxcs.xmidEntity', 'xmidEntity')
          .leftJoin('h13_yzzxcs.h13YzzxcsTfList', 'tfEntity')
          .addSelect(['xmidEntity.xmid', 'xmidEntity.xmmc', 'xmidEntity.ggxh', 'xmidEntity.xmzl'])
          .leftJoin('h13_yzzxcs.h31Lyjl', 'H31Lyjl')
          .addSelect([
            'H31Lyjl.zyid',
            'H31Lyjl.djbh',
            'H31Lyjl.tjbz',
            'H31Lyjl.ckclbz',
            'H31Lyjl.ksid',
            'H31Lyjl.fhksid',
            'tfEntity.bzxcs',
            'tfEntity.clbz',
          ])
          .where('h13_yzzxcs.zyid = :zyid and h13_yzzxcs.maxid IN (:...maxidList)', {
            zyid: dto.zyid,
            maxidList: maxidList,
          })
          .getMany();

        if (!h13_yzzxcsList.length) return;

        const tfListToInsert: H13YzzxcsTf[] = this.createRefundList(h13_yzzxcsList, dto.maxidList, {
          zyid: dto.zyid,
          yzlx: dto.yzlx,
          zxhs: dto.zxhs,
        });
        // console.log('退费记录tfListToInsert:------', tfListToInsert);

        // 批量保存主记录和退费记录
        await Promise.all([h13Repo.save(h13_yzzxcsList), H13YzzxcsTfRepo.save(tfListToInsert)]);
      } catch (error: any) {
        this.logger.error('退费失败', error?.stack ?? error?.message ?? error);
        throw new CustomException(ERR.ERR_10000, error?.message ?? '退费失败');
      }
    });
  }

  private createRefundList(
    h13_yzzxcsList: h13_yzzxcs[],
    costFees: costDto[],
    dto: { zyid: string; yzlx: number; zxhs: string }, //adviceDto,
  ) {
    const tfListToInsert: H13YzzxcsTf[] = [];
    // const gs_cxsz = await this.configReaderService.readGsCxsz();
    for (const item of h13_yzzxcsList) {
      if (item.h13YzzxcsTfList) {
        throw new BadRequestException('已经产生退费记录，请咨询同事！');
      }

      // 检查项目是否已执行
      if (
        item.fybz === 0 &&
        item.clbz === 1 &&
        item.fylbid !== '01' && // 西药
        item.fylbid !== '02' && // 中草药
        item.fylbid !== '03' && // 中成料
        item.fylbid !== '15' && // 材料
        item.fylbid !== '90' // 疫苗
      ) {
        throw new CustomException(
          ERR.ERR_10000,
          `该项目已执行:${item.xmidEntity.xmmc},请医技科室取消执行！`,
        );
      }

      const countsl = (item.zxcs - item.bzxcs) * item.jfyl;

      if (countsl <= 0) {
        throw new CustomException(ERR.ERR_10000, '该记录已退费，请咨询同事！');
      }

      // 处理退费数量
      const dtoItem = costFees.find((cost) => cost.maxid === item.maxid);

      if (dtoItem.bzxcs > item.zxcs && dtoItem.bzxcs > 0) {
        throw new CustomException(
          ERR.ERR_10000,
          `[${item.xmidEntity.xmmc}] 不执行次数不能大于执行次数且不能小于0!`,
        );
      }

      if (dtoItem.bzxcs === 0) continue;

      // 创建退费记录
      tfListToInsert.push({
        ...item,
        czrq: new Date(),
        //zxrq: new Date(),
        fydh: '', // 发药单号清空
        zxcs2: item.maxid,
        zxhs: dto.zxhs,
        zxcs: -1 * dtoItem.bzxcs,
        bzxcs: 0,
        tyrid: dto.zxhs,
        tysj: new Date(), // 退药时间为当前时间？
        sysj: null,
        clbz: 0,
        fybz: 0,
      } as any);

      //控制台输出退费记录tfListToInsert
      //console.log('退费记录tfListToInsert:------', tfListToInsert);
      // 修改主记录的已退次数
      item.bzxcs = dtoItem.bzxcs;
      // item.H31Lyjl = undefined as any;
      item.h13YzzxcsTfList = undefined as any;
    }
    return tfListToInsert;
  }

  // -------------------------
  // 退回医嘱给医生
  // -------------------------
  async refundAdvice(dto: adviceDto) {
    const { zyid, yzlx, mxxhList, zxhs } = dto;

    // 检查是否有医嘱
    if (!mxxhList || mxxhList.length === 0) {
      throw new CustomException(ERR.ERR_10000, '未有医嘱!');
    }

    // 兼容前端传入的两种格式：数字数组或包含mxxh属性的对象数组
    const mxxhValues = mxxhList
      .map((item) => {
        if (typeof item === 'object' && item !== null && 'mxxh' in item) {
          return item.mxxh;
        }
        return Number(item);
      })
      .filter((mxxh) => !isNaN(mxxh));

    // 检查是否有有效的mxxh
    if (mxxhValues.length === 0) {
      throw new CustomException(ERR.ERR_10000, '未有有效的医嘱!');
    }

    // 获取医嘱主表信息
    const yzxbList = await this.h12_yzxbRepo.find({
      where: {
        zyid,
        yzlx,
        mxxh: In(mxxhValues),
        ysbz: 1, // 有效医嘱
      },
      select: [
        'zyid',
        'mxxh',
        'sjbz',
        'yzzh',
        'xmid',
        'xmmc',
        'yzlx',
        'yzxh',
        'tpbz',
        'fylbid',
        'yzzt',
        'tjbz',
        'tzbz',
        'zxbz',
        'hdbz',
        'clbz',
        'kshs',
        'jshs',
        'kssxhs',
        'jssxhs',
        'hdhs',
        'hshd',
        'hshdrq',
        'tzrq',
      ],
    });

    // 检查医嘱是否存在
    if (yzxbList.length === 0) {
      throw new CustomException(ERR.ERR_10000, '未有医嘱!');
    }

    // 获取系统参数配置
    const gs_cxsz = await this.configReaderService.readGsCxsz();

    // 事务处理
    await this.dataSource.transaction(async (manager) => {
      for (const item of yzxbList) {
        // 检查是否为作废医嘱
        if (item.sjbz === 0) {
          throw new CustomException(ERR.ERR_10000, `【${item.xmmc}】作废医嘱不能退回!`);
        }

        // 中药按单个处理（PB代码中调用了ue_hsth_dgzy事件）
        if ((item.fylbid === '02' || item.fylbid === '90') && item.yzzh === 0) {
          // 这里可以添加中药的特殊处理逻辑
          continue;
        }

        // 检查是否有执行记录
        const queryBuilder = manager
          .createQueryBuilder(h13_yzzxcs, 'h13')
          .select('ISNULL(SUM((h13.zxcs - h13.bzxcs) * h13.jfyl), 0)', 'count')
          .where('h13.zyid = :zyid', { zyid })
          .andWhere('h13.yzlx = :yzlx', { yzlx: item.yzlx })
          .andWhere('h13.mxxh = :mxxh', { mxxh: item.mxxh });

        // 根据tpbz设置不同的条件
        const fylbids = ['01', '02', '03', '15'];
        if (item.tpbz === 1) {
          queryBuilder.andWhere(
            "((h13.fylbid IN (:...fylbids) AND h13.fybz = 1) OR (h13.fylbid NOT IN (:...fylbids)) OR (ISNULL(h13.fydh, '') <> '' AND ISNULL(h13.fybz, 0) = 0))",
            { fylbids },
          );
        } else {
          queryBuilder.andWhere(
            "((h13.fylbid IN (:...fylbids) AND h13.fybz = 1) OR (h13.fylbid NOT IN (:...fylbids)) OR (ISNULL(h13.fydh, '') <> '' AND ISNULL(h13.fybz, 0) = 0))",
            { fylbids },
          );
        }
        //控制台打印queryBuilder的sql语句
        // console.log("检查是否有执行记录sql:-----"+queryBuilder.getQuery());

        const result = await queryBuilder.getRawOne();
        const ll_count = parseFloat(result.count) || 0;

        // 如果有执行记录，提示不能退回
        if (ll_count > 0) {
          throw new CustomException(
            ERR.ERR_10000,
            `【${item.xmmc}】已执行医嘱或生成领药单，请护士取消执行次数，再退回!`,
          );
        }

        // console.log('系统版本号:', gs_cxsz.kssz);
        // 第3,4,5版，必须退药了，才可以退回
        if (['3', '4', '5'].includes(gs_cxsz.kssz)) {
          // 检查退费记录是否有未发药
          // 创建查询构建器实例
          const queryBuilder = manager
            .createQueryBuilder(H13YzzxcsTf, 'h13_tf')
            .select('COUNT(*)', 'count')
            .where('h13_tf.zyid = :zyid', { zyid })
            .andWhere('h13_tf.yzlx = :yzlx', { yzlx: item.yzlx })
            .andWhere(
              'EXISTS (SELECT 1 FROM h13_yzzxcs h13 WHERE ' +
                'h13.zyid = h13_tf.zyid ' +
                'AND h13.maxid = h13_tf.zxcs2 ' +
                'AND h13.yzzh = :yzzh ' +
                'AND h13.yzlx = :yzlx ' +
                'AND ISNULL(h13.fybz, 0) = 1)',
              {
                yzzh: item.yzzh,
                yzlx: item.yzlx,
              },
            )
            .andWhere('ISNULL(h13_tf.fybz, 0) = 0');

          // 输出SQL语句和参数到控制台
          const sql = queryBuilder.getSql();
          const parameters = queryBuilder.getParameters();
          console.log('检查退费记录的SQL语句:', sql);
          console.log('SQL参数:', parameters);

          // 执行查询
          const tfCount = await queryBuilder.getRawOne();

          if (parseInt(tfCount.count, 10) > 0) {
            throw new CustomException(
              ERR.ERR_10000,
              `【${item.xmmc}】退药记录未发药，不能退回医生，请关联药房先退药!`,
            );
          }

          // 第5版，检查退药记录是否未生成发药
          if (gs_cxsz.kssz === '5') {
            const tfCount2 = await manager
              .createQueryBuilder(H13YzzxcsTf, 'h13_tf')
              .select('COUNT(*)', 'count')
              .where('h13_tf.zyid = :zyid', { zyid })
              .andWhere('h13_tf.yzlx = :yzlx', { yzlx: item.yzlx })
              .andWhere(
                "EXISTS (SELECT 1 FROM h13_yzzxcs h13 WHERE h13.zyid = h13_tf.zyid AND h13.maxid = h13_tf.zxcs2 AND h13.yzzh = :yzzh AND h13.yzlx = :yzlx AND ISNULL(h13.fydh, '') <> '')",
                {
                  yzzh: item.yzzh,
                  yzlx: item.yzlx,
                },
              )
              .andWhere("ISNULL(h13_tf.fydh, '') = ''")
              .getRawOne();

            if (parseInt(tfCount2.count, 10) > 0) {
              throw new CustomException(
                ERR.ERR_10000,
                `【${item.xmmc}】退药记录未生成发药，不能退回医生，请关联护士生成领药单!`,
              );
            }
          }
        }

        // 更新医嘱状态
        item.yzzt = 0;
        item.tjbz = 0;
        item.tzbz = 0;
        item.zxbz = 0;
        item.hdbz = 0;
        item.clbz = 0;
        item.kshs = '';
        item.jshs = '';
        item.kssxhs = '';
        item.jssxhs = '';
        item.hdhs = '';
        item.hshd = '';
        item.hshdrq = null;
        item.zxrq = null; //执行时间
        if (item.yzlx === 2) {
          item.tzrq = null;
        }
        // //根据item的yzzh字段查询出h12_yzxb表的所有记录 (项目同组:附加项目)
        // const yzzhyzxbList = await manager.find(h12_yzxb, {
        //   where: {
        //     zyid,
        //     yzxh: item.yzxh,
        //     yzlx: item.yzlx,
        //     yzzh: item.yzzh,
        //   }
        // });
        // //判断yzzhyzxbList如不为空且有记录，则把里面的所有记录的zxrq字段设置为null(项目同组:附加项目)
        // if (yzzhyzxbList.length > 0) {
        //   yzzhyzxbList.forEach(yzxb => {
        //     yzxb.zxrq = null;
        //   });
        // }

        // 保存更新
        await manager.save(item);

        // 更新附加项目
        await manager.update(
          h12_yzxb,
          { zyid, yzxh: item.yzxh, yzlx: item.yzlx, yzzh: item.yzzh, ysbz: 0, zxrq: null },
          { yzzt: 0, tjbz: 0, tzbz: 0, zxbz: 0, hdbz: 0, clbz: 0, kshs: '', jshs: '' },
        );

        // 删除预扣库存
        await manager.query(
          `UPDATE h31_kcxx SET dfsl = ISNULL(dfsl, 0) - fy.sl
           FROM (SELECT SUM((h13.zxcs - h13.bzxcs) * h13.jfyl * h13.kyts) sl,
                 h13.zyid, h13.scph, h13.zkksid, h13.xmid
                 FROM h13_yzzxcs h13
                 WHERE h13.zyid = @0 AND h13.yzzh = @1 AND h13.yzlx = @2
                 AND ISNULL(h13.fybz, 0) = 0
                 GROUP BY h13.zyid, h13.scph, h13.zkksid, h13.xmid) fy
           WHERE h31_kcxx.ypid = fy.xmid AND h31_kcxx.scph = fy.scph AND h31_kcxx.ksid = fy.zkksid`,
          [zyid, item.yzzh, item.yzlx],
        );

        // 删除执行记录
        await manager.delete(h13_yzzxcs, { zyid, yzlx: item.yzlx, mxxh: item.mxxh });

        // 删除退费记录
        await manager.delete(H13YzzxcsTf, { zyid, yzlx: item.yzlx, mxxh: item.mxxh });

        // 调用check方法替代存储过程调用
        const checkResult = await this.check({
          zyid,
          ksid: zxhs,
          xmid: item.xmid,
          xmmc: item.xmmc,
          xmgg: item.xmgg || '',
          scph: item.scph || '',
          sl: 0,
          mxxh: item.mxxh,
          al: 2,
        });

        // 检查check方法返回结果
        if (checkResult.rtn !== 1) {
          throw new CustomException(
            ERR.ERR_10000,
            `药品扣库存失败！项目：${checkResult.xmidn} 批次：${checkResult.scph} 错误信息：${checkResult.msg}`,
          );
        }
      }
    });

    return true;
  }

  /**
   * 实现sp_h13kcxx_check存储过程功能
   * @param params 存储过程参数
   * @returns 执行结果
   */
  private async check(params: {
    zyid: string;
    ksid: string;
    xmid: string;
    xmmc: string;
    xmgg: string;
    scph: string;
    sl: number;
    mxxh: number;
    al: number;
  }): Promise<{
    xmidn: string;
    scph: string;
    rtn: number;
    msg: string;
  }> {
    const { zyid, ksid, xmid, xmmc, xmgg, scph, sl, mxxh, al } = params;

    let xmidn = xmid;
    let returnScph = scph;
    let rtn = 1;
    let msg = 'OK!';

    // 如果是已执行状态，直接返回
    if (al === 2) {
      return { xmidn, scph: returnScph, rtn, msg };
    }

    // 删除c00_fbxx表中的记录
    await this.dataSource.query(
      `DELETE FROM c00_fbxx WHERE zyid = @0 AND xmid = @1 AND mxxh = @2`,
      [zyid, xmid, mxxh],
    );

    // 检查药品是否需要库存管理
    const h30Result = await this.dataSource.query(
      `SELECT ISNULL(jsl2, 0) as jsl2 FROM h30_ypzd WHERE ypid = @0`,
      [xmid],
    );

    const ll_kcgl = h30Result.length > 0 ? h30Result[0].jsl2 : 0;
    if (ll_kcgl !== 0 || sl === 0) {
      rtn = 1;
      msg = 'OK!';
      return { xmidn, scph: returnScph, rtn, msg };
    }

    // 检查出库设置（是否允许库存负数）
    const sysparResult = await this.dataSource.query(
      `SELECT LTRIM(RTRIM(pval)) as pval FROM __syspar WHERE syid = '30' AND prid = 'cksl'`,
    );

    const ls_ckbz = sysparResult.length > 0 && sysparResult[0].pval ? sysparResult[0].pval : '1';

    // 获取药品的销售系数和药品分类
    const ypzdResult = await this.dataSource.query(
      `SELECT ISNULL(esxs, 1) as esxs, ypfl FROM h30_ypzd WHERE ypid = @0 AND jsl2 = 0`,
      [xmid],
    );

    if (ypzdResult.length === 0) {
      rtn = 1;
      msg = 'OK!';
      return { xmidn, scph: returnScph, rtn, msg };
    }

    const ld_xs = ypzdResult[0].esxs;
    const ypfl = ypzdResult[0].ypfl;

    // 检查库存数量是否足够
    const ls_ks = ksid.trim();
    const kcxxResult = await this.dataSource.query(
      `SELECT TOP 1 ISNULL(xsl, 0) - ABS(ISNULL(mzdfsl, 0) + ISNULL(dfsl, 0) + ISNULL(ssdfsl, 0) - @0) as kcsl
       FROM h31_kcxx
       WHERE ypid = @1 AND yxbz = 1 AND ksid IN (@2) AND
       ISNULL(xsl, 0) - (ISNULL(mzdfsl, 0) + ISNULL(dfsl, 0) + ISNULL(ssdfsl, 0)) - @0 >= 0 AND scph = @3
       ORDER BY sxrq, scph`,
      [sl, xmid, ls_ks, scph],
    );

    if (kcxxResult.length === 0) {
      // 如果是特殊药品分类，返回成功
      if (ypfl === '17') {
        returnScph = scph;
        xmidn = xmid;
        rtn = 1;
        msg = 'OK!';
        return { xmidn, scph: returnScph, rtn, msg };
      }

      // 如果允许库存负数，返回成功
      if (ls_ckbz === '2') {
        rtn = 1;
        msg = 'OK!';
        return { xmidn, scph: returnScph, rtn, msg };
      }

      // 尝试查找其他批次
      const otherBatchResult = await this.dataSource.query(
        `SELECT TOP 1 ISNULL(xsl, 0) - ISNULL(mzdfsl, 0) - ISNULL(dfsl, 0) - ISNULL(ssdfsl, 0) as kcsl,
                scph, ypid
         FROM h31_kcxx
         WHERE ypid = @0 AND ksid IN (@1) AND yxbz = 1 AND
         ISNULL(xsl, 0) - ABS(ISNULL(mzdfsl, 0) + ISNULL(dfsl, 0) + ISNULL(ssdfsl, 0)) - @2 >= 0
         ORDER BY sxrq, scph`,
        [xmid, ls_ks, sl],
      );

      if (otherBatchResult.length > 0) {
        returnScph = otherBatchResult[0].scph;
        xmidn = otherBatchResult[0].ypid;
        rtn = 1;
        msg = 'OK!';
        return { xmidn, scph: returnScph, rtn, msg };
      }

      // 尝试查找同类药品
      const sameTypeResult = await this.dataSource.query(
        `SELECT TOP 1 ISNULL(xsl, 0) - ISNULL(mzdfsl, 0) - ISNULL(dfsl, 0) - ISNULL(ssdfsl, 0) as kcsl,
                scph, ypid
         FROM h31_kcxx
         WHERE ksid IN (@0) AND yxbz = 1 AND
         ISNULL(xsl, 0) - ABS(ISNULL(mzdfsl, 0) + ISNULL(dfsl, 0) + ISNULL(ssdfsl, 0)) - @1 >= 0 AND
         ypid IN (SELECT ypid FROM h30_ypzd WHERE zwmc = @2 AND
                 ((ypgg = @3 AND ypflid NOT IN ('02','90')) OR (ypflid IN ('02','90'))))
         ORDER BY ypid, scph`,
        [ls_ks, sl, xmmc, xmgg],
      );

      if (sameTypeResult.length === 0) {
        // 尝试查找关联药品
        const relatedResult = await this.dataSource.query(
          `SELECT TOP 1 ISNULL(xsl, 0) - ISNULL(mzdfsl, 0) - ISNULL(dfsl, 0) - ISNULL(ssdfsl, 0) as kcsl,
                  scph, ypid
           FROM h31_kcxx
           WHERE ksid IN (@0) AND yxbz = 1 AND
           ISNULL(xsl, 0) - ABS(ISNULL(mzdfsl, 0) + ISNULL(dfsl, 0) + ISNULL(ssdfsl, 0)) - @1 >= 0 AND
           ypid IN (SELECT glypid FROM h30_ypgl WHERE ypid = @2)
           ORDER BY ypid, sxrq, scph`,
          [ls_ks, sl, xmid],
        );

        if (relatedResult.length === 0) {
          // 库存不足
          rtn = -1;
          msg = `库存量不足`;
          return { xmidn, scph: returnScph, rtn, msg };
        }
      }
    }

    return { xmidn, scph: returnScph, rtn, msg };
  }

  // -------------------------
  // 办理出院
  // 办理出院
  // -------------------------
  async out(dto: outDto): Promise<OutResponse> {
    try {
      // 接收出院时间并格式化
      const ldt_zksj = new Date(dto.cysj);
      const ls_sj = this.formatDate(ldt_zksj, 'yyyy.mm.dd');

      // 获取入院时间并格式化
      const brxx = await this.h11BrxxRepo.findOne({
        where: { zyid: dto.zyid },
        select: ['rysj'],
      });

      if (!brxx || !brxx.rysj) {
        throw new CustomException(ERR.ERR_10000, '未找到患者入院信息');
      }

      const ldt_rysj = new Date(brxx.rysj);
      ldt_rysj.setHours(0, 0, 0, 0); // 设置时间为00:00:00
      const ls_rq = this.formatDate(ldt_rysj, 'yyyy.mm.dd');

      // 校验：医嘱执行时间早于入院日期
      const li_rycount = await this.h13_yzzxcsRepo
        .createQueryBuilder('h13')
        .select('COUNT(*)', 'count')
        .where('h13.zyid = :zyid AND h13.zxrq < :rysj', {
          zyid: dto.zyid,
          rysj: ldt_rysj,
        })
        .getRawOne();

      if (parseInt(li_rycount.count, 10) > 0) {
        return createErrorResponse(
          `执行时间小于入院日期"${ls_rq}"，请删除多余次数后出院!`,
          ERR.ERR_10000.code,
          false, // 不需要详细表单
        );
      }

      // 校验：医嘱执行时间晚于出院日期
      const li_yzzxcscount = await this.h13_yzzxcsRepo
        .createQueryBuilder('h13')
        .select('COUNT(*)', 'count')
        .where('h13.zyid = :zyid AND h13.zxrq > :zksj', {
          zyid: dto.zyid,
          zksj: ldt_zksj,
        })
        .getRawOne();

      if (parseInt(li_yzzxcscount.count, 10) > 0) {
        return createErrorResponse(
          '执行时间大于出院时间，请删除多余次数后出院!',
          ERR.ERR_10000.code,
          false, // 不需要详细表单
        );
      }

      // 未发药校验 - 获取系统参数
      const { xyksid, cyksid, zyksid, clksid, qtksid, zjksid, ssclksid, jpksid, hlksid } =
        await this.configReaderService.readYfCxsz(brxx.cyksid);

      // 1. 校验h13_yzzxcs和h12_yzxb表中未发药记录
      const wfylist = await this.h13_yzzxcsRepo
        .createQueryBuilder('h13')
        .innerJoin(
          'h12_yzxb',
          'h12',
          'h13.yzxh = h12.yzxh AND h13.yzlx = h12.yzlx AND h13.zyid = h12.zyid AND h13.mxxh = h12.mxxh',
        )
        .select([
          'h12.yzlx as yzlx',
          'h12.mxxh as mxxh',
          'h12.yzrq as yzrq',
          'h12.xmid as xmid',
          'h12.xmmc as xmmc',
          'h13.jfyl as jfyl',
          'h12.syffid as syffid',
          'h12.syplid as syplid',
          'h12.ksys as ksys',
          'h12.kshs as kshs',
        ])
        .where('h13.zyid = :zyid', { zyid: dto.zyid })
        .andWhere('(ISNULL(h13.fybz, 0) <> 1)')
        .andWhere('(h12.xmzl = 2 OR h12.xmzl = 3)')
        .andWhere('(h13.zxcs - h13.bzxcs) > 0')
        .andWhere('h13.jfyl > 0')
        .andWhere('h13.zkksid IN (:...ksidList)', {
          ksidList: [
            xyksid,
            cyksid,
            zyksid,
            clksid,
            qtksid,
            zjksid,
            ssclksid,
            jpksid,
            hlksid,
          ].filter(Boolean),
        })
        .getRawMany();
      //控制台输出 校验药品未发药记录的实际sql
      // console.log("校验药品未发药记录的实际sql:", wfylist);

      if (wfylist.length > 0) {
        // 提取所有需要转换的工号
        const usids = [
          ...new Set([
            ...wfylist.map((item) => item.ksys).filter(Boolean),
            ...wfylist.map((item) => item.kshs).filter(Boolean),
          ]),
        ];

        // 批量查询工号对应的名称
        const usrInfoMap = new Map<string, string>();
        if (usids.length > 0) {
          const usrList = await this.usrcatRepo.find({
            where: { usid: In(usids) },
            select: ['usid', 'unam'],
          });
          usrList.forEach((usr) => {
            if (usr.unam) {
              usrInfoMap.set(usr.usid, usr.unam);
            }
          });
        }

        // 格式化未发药明细信息
        const wfymx = wfylist
          .map((item) => {
            const ksysName = usrInfoMap.get(item.ksys) || item.ksys;
            const kshsName = usrInfoMap.get(item.kshs) || item.kshs;
            return `药品：${item.xmmc}，医嘱类型：${item.yzlx}，明细号：${item.mxxh}，医嘱日期：${item.yzrq}，项目ID：${item.xmid}，用量：${item.jfyl}，使用方法：${item.syffid}，使用频率：${item.syplid}，科室医生：${ksysName}，科室护士：${kshsName}`;
          })
          .join('\n');

        // 更新返回给前端的明细，将工号转换为名称
        const formattedWfylist = wfylist.map((item) => ({
          ...item,
          ksysName: usrInfoMap.get(item.ksys) || item.ksys,
          kshsName: usrInfoMap.get(item.kshs) || item.kshs,
        }));

        return createErrorResponse(
          // `有药品未发药，不能办理出院：\n${wfymx}`,
          `有药品未发药，不能办理出院`,
          ERR.ERR_10000.code,
          true, // 需要详细表单
          formattedWfylist,
        );
      }

      // 2. 校验h13_yzzxcs_tf和h12_yzxb表中未发药的退费记录
      const tfwfylist = await this.dataSource
        .createQueryBuilder()
        .select([
          'h12.yzlx as yzlx',
          'h12.mxxh as mxxh',
          'h12.yzrq as yzrq',
          'h12.xmid as xmid',
          'h12.xmmc as xmmc',
          'h13tf.jfyl as jfyl',
          'h12.syffid as syffid',
          'h12.syplid as syplid',
          'h12.ksys as ksys',
          'h12.kshs as kshs',
        ])
        .from('h13_yzzxcs_tf', 'h13tf')
        .innerJoin(
          'h12_yzxb',
          'h12',
          'h13tf.yzxh = h12.yzxh AND h13tf.yzlx = h12.yzlx AND h13tf.zyid = h12.zyid AND h13tf.mxxh = h12.mxxh',
        )
        .where('h13tf.zyid = :zyid', { zyid: dto.zyid })
        .andWhere('(ISNULL(h13tf.fybz, 0) <> 1)')
        .andWhere('(h12.xmzl = 2 OR h12.xmzl = 3)')
        .andWhere('ABS(h13tf.zxcs - h13tf.bzxcs) > 0')
        .andWhere('h13tf.jfyl > 0')
        .andWhere('h13tf.zkksid IN (:...ksidList)', {
          ksidList: [
            xyksid,
            cyksid,
            zyksid,
            clksid,
            qtksid,
            zjksid,
            ssclksid,
            jpksid,
            hlksid,
          ].filter(Boolean),
        })
        .getRawMany();
      //控制台输出 校验药品退费未发药记录的实际sql
      // console.log("校验药品退费未发药记录的实际sql:", tfwfylist);

      if (tfwfylist.length > 0) {
        // 提取所有需要转换的工号
        const tfUsids = [
          ...new Set([
            ...tfwfylist.map((item) => item.ksys).filter(Boolean),
            ...tfwfylist.map((item) => item.kshs).filter(Boolean),
          ]),
        ];

        // 批量查询工号对应的名称
        const tfUsrInfoMap = new Map<string, string>();
        if (tfUsids.length > 0) {
          const tfUsrList = await this.usrcatRepo.find({
            where: { usid: In(tfUsids) },
            select: ['usid', 'unam'],
          });
          tfUsrList.forEach((usr) => {
            if (usr.unam) {
              tfUsrInfoMap.set(usr.usid, usr.unam);
            }
          });
        }

        // 格式化未发药退费明细信息
        const tfwfymx = tfwfylist
          .map((item) => {
            const ksysName = tfUsrInfoMap.get(item.ksys) || item.ksys;
            const kshsName = tfUsrInfoMap.get(item.kshs) || item.kshs;
            return `药品：${item.xmmc}，医嘱类型：${item.yzlx}，明细号：${item.mxxh}，医嘱日期：${item.yzrq}，项目ID：${item.xmid}，用量：${item.jfyl}，使用方法：${item.syffid}，使用频率：${item.syplid}，科室医生：${ksysName}，科室护士：${kshsName}`;
          })
          .join('\n');

        // 更新返回给前端的明细，将工号转换为名称
        const formattedTfwfylist = tfwfylist.map((item) => ({
          ...item,
          ksysName: tfUsrInfoMap.get(item.ksys) || item.ksys,
          kshsName: tfUsrInfoMap.get(item.kshs) || item.kshs,
        }));

        return createErrorResponse(
          `有药品退费未发药，不能办理出院`,
          ERR.ERR_10000.code,
          true, // 需要详细表单
          formattedTfwfylist,
        );
      }

      // 3. 校验手术医嘱未发药记录
      const sswfylist = await this.dataSource
        .createQueryBuilder()
        .select('COUNT(*)', 'count')
        .from('h15_sszb', 'sszb')
        .innerJoin('h15_ssxb', 'ssxb', 'ssxb.zyid = sszb.zyid AND ssxb.ssid = sszb.ssid')
        .innerJoin('h11_brxx', 'brxx', 'sszb.zyid = brxx.zyid')
        .where('sszb.zyid = :zyid', { zyid: dto.zyid })
        .andWhere('ABS(ssxb.jfyl) > 0')
        .andWhere('ISNULL(ssxb.tpbz, 0) = 0')
        .andWhere('ISNULL(ssxb.tjbz, 0) = 1')
        .andWhere('ssxb.xmzl IN (2, 3)')
        .andWhere('ssxb.zxksid IN (:...ksidList)', {
          ksidList: [
            xyksid,
            cyksid,
            zyksid,
            clksid,
            qtksid,
            zjksid,
            ssclksid,
            jpksid,
            hlksid,
          ].filter(Boolean),
        })
        .getRawOne();
      //控制台输出 校验手术医嘱未发药记录的实际sql
      // console.log("校验手术医嘱未发药记录的实际sql:", sswfylist);

      if (parseInt(sswfylist.count, 10) > 0) {
        throw new CustomException(ERR.ERR_10000, '手术医嘱未发药不能办出院');
      }

      if (sswfylist.length > 0) {
        // 提取所有需要转换的工号
        const ssUsids = [
          ...new Set([
            ...sswfylist.map((item) => item.ksys).filter(Boolean),
            ...sswfylist.map((item) => item.kshs).filter(Boolean),
          ]),
        ];

        // 批量查询工号对应的名称
        const ssUsrInfoMap = new Map<string, string>();
        if (ssUsids.length > 0) {
          const ssUsrList = await this.usrcatRepo.find({
            where: { usid: In(ssUsids) },
            select: ['usid', 'unam'],
          });
          ssUsrList.forEach((usr) => {
            if (usr.unam) {
              ssUsrInfoMap.set(usr.usid, usr.unam);
            }
          });
        }

        // 格式化手术医嘱未发药明细信息
        const sswfymx = sswfylist
          .map((item) => {
            const ksysName = ssUsrInfoMap.get(item.ksys) || item.ksys;
            const kshsName = ssUsrInfoMap.get(item.kshs) || item.kshs;
            return `药品：${item.xmmc}，医嘱类型：${item.yzlx}，明细号：${item.mxxh}，医嘱日期：${item.yzrq}，项目ID：${item.xmid}，用量：${item.jfyl}，使用方法：${item.syffid}，使用频率：${item.syplid}，科室医生：${ksysName}，科室护士：${kshsName}`;
          })
          .join('\n');

        // 更新返回给前端的明细，将工号转换为名称
        const formattedSswfylist = sswfylist.map((item) => ({
          ...item,
          ksysName: ssUsrInfoMap.get(item.ksys) || item.ksys,
          kshsName: ssUsrInfoMap.get(item.kshs) || item.kshs,
        }));
        return createErrorResponse(
          `有手术医嘱未发药，不能办理出院`,
          ERR.ERR_10000.code,
          true, // 需要详细表单
          formattedSswfylist,
        );
      }

      // 校验：实习医生未签名
      const li_jmcount1 = await this.h12_yzxbRepo
        .createQueryBuilder('h12')
        .select('COUNT(*)', 'count')
        .where(
          'h12.zyid = :zyid AND (h12.yzlx = 1 OR h12.yzlx = 2) AND h12.ysbz = 1 AND h12.jsbz <> 1 AND h12.sjbz = 1 AND (h12.ksys = :empty OR h12.ksys IS NULL) AND h12.xmid <> :xmid',
          {
            zyid: dto.zyid,
            empty: '',
            xmid: '0000000',
          },
        )
        .getRawOne();

      if (parseInt(li_jmcount1.count, 10) > 0) {
        // throw new CustomException(ERR.ERR_10000, '实习医生未签名，请医生签名后再出院!');
        return createErrorResponse(
          '实习医生未签名，请医生签名后再出院!',
          ERR.ERR_10000.code,
          true, // 需要详细表单
          li_jmcount1,
        );
      }

      // 校验：医嘱未复核
      const weiFuhelist = await this.h12_yzxbRepo
        .createQueryBuilder('h12')
        .leftJoin(
          'h13_yzzxcs',
          'h13',
          'h13.yzxh = h12.yzxh AND h13.yzlx = h12.yzlx AND h13.zyid = h12.zyid AND h13.mxxh = h12.mxxh',
        )
        .select([
          'h12.yzlx as yzlx',
          'h12.mxxh as mxxh',
          'h12.yzrq as yzrq',
          'h12.xmid as xmid',
          'h12.xmmc as xmmc',
          'h13.jfyl as jfyl',
          'h12.syffid as syffid',
          'h12.syplid as syplid',
          'h12.ksys as ksys',
          'h12.kshs as kshs',
        ])
        .where(
          'h12.zyid = :zyid AND h12.ysbz = 1 AND h12.jsbz <> 1 AND h12.sjbz = 1 AND h12.yzlx <> 6 AND (h12.hdbz = 0 OR (h12.yzlx = 1 AND h12.tzbz = 1 AND (h12.jshs = :empty OR h12.jshs IS NULL))) AND h12.xmid <> :xmid',
          {
            zyid: dto.zyid,
            empty: '',
            xmid: '0000000',
          },
        )
        .getRawMany();

      if (weiFuhelist.length > 0) {
        // 转换ksys和kshs字段为名称
        const uniqueUsids = new Set<string>();
        weiFuhelist.forEach((item) => {
          if (item.ksys) uniqueUsids.add(item.ksys);
          if (item.kshs) uniqueUsids.add(item.kshs);
        });

        const usidArray = Array.from(uniqueUsids);
        const usrInfoList = await this.usrcatRepo.find({
          where: { usid: In(usidArray) },
          select: ['usid', 'unam'],
        });

        const usrInfoMap = new Map<string, string>();
        usrInfoList.forEach((usr) => {
          usrInfoMap.set(usr.usid, usr.unam);
        });

        // 格式化未复核医嘱明细信息并转换工号为名称
        const formattedWeiFuhelist = weiFuhelist.map((item) => {
          const ksysName = usrInfoMap.get(item.ksys) || item.ksys;
          const kshsName = usrInfoMap.get(item.kshs) || item.kshs;
          return {
            ...item,
            ksysName,
            kshsName,
          };
        });

        // 格式化错误消息
        const weiFuheMx = formattedWeiFuhelist
          .map((item) => {
            return `项目：${item.xmmc}，医嘱类型：${item.yzlx}，明细号：${item.mxxh}，医嘱日期：${item.yzrq}，项目ID：${item.xmid}，用量：${item.jfyl || 0}，使用方法：${item.syffid}，使用频率：${item.syplid}，科室医生：${item.ksysName}，科室护士：${item.kshsName}`;
          })
          .join('\n');

        // throw new CustomException(ERR.ERR_10000, `有医嘱未复核，请复核后再出院：\n${weiFuheMx}`);
        return createErrorResponse(
          `有医嘱未复核，请复核后再出院`,
          ERR.ERR_10000.code,
          true, // 需要详细表单
          formattedWeiFuhelist,
        );
      }

      // 校验：护士未签名
      const li_jmcount3 = await this.h12_yzxbRepo
        .createQueryBuilder('h12')
        .select('COUNT(*)', 'count')
        .where(
          'h12.zyid = :zyid AND (h12.yzlx = 1 OR h12.yzlx = 2) AND h12.ysbz = 1 AND h12.jsbz <> 1 AND h12.sjbz = 1 AND (h12.kshs = :empty OR h12.kshs IS NULL) AND h12.xmid <> :xmid',
          {
            zyid: dto.zyid,
            empty: '',
            xmid: '0000000',
          },
        )
        .getRawOne();

      if (parseInt(li_jmcount3.count, 10) > 0) {
        return createErrorResponse(
          '开始护士未签名，请护士签名后再出院!',
          ERR.ERR_10000.code,
          false, // 不需要详细表单
        );
      }

      // 校验：未执行项目
      // 从系统参数获取未执行项目分类
      const gsCxsz = await this.syspar_newService.findOne('99', 'yjzxsflb');
      if (gsCxsz && gsCxsz.pval && gsCxsz.pval.trim().length > 0) {
        const fylbidList = gsCxsz.pval.split(',').map((id) => id.trim());

        const li_yzzxcscount = await this.h13_yzzxcsRepo
          .createQueryBuilder('h13')
          .select('COUNT(*)', 'count')
          .where(
            'h13.zyid = :zyid AND h13.sfbz = 0 AND h13.xmdj > 0 AND h13.fylbid IN (:...fylbidList)',
            {
              zyid: dto.zyid,
              fylbidList,
            },
          )
          .getRawOne();

        if (parseInt(li_yzzxcscount.count, 10) > 0) {
          // throw new CustomException(ERR.ERR_10000, '该病人有项目未执行，请医技科室执行后再出院！');
          return createErrorResponse(
            '该病人有项目未执行，请医技科室执行后再出院！',
            ERR.ERR_10000.code,
            true, // 需要详细表单
            li_yzzxcscount,
          );
        }
      }

      // 计算住院天数
      const ll_zyts = Math.floor((ldt_zksj.getTime() - ldt_rysj.getTime()) / (1000 * 60 * 60 * 24));
      const final_zyts = ll_zyts === 0 ? 1 : ll_zyts;

      // 床位天数核对、诊查天数核对、护理天数核对
      // 这里暂时不实现，需要额外的查询逻辑

      // 医嘱停嘱校验/处理
      const gs_xtcs = await this.syspar_newService.findOne('99', 'cyyzbz');
      const cyyzbz = gs_xtcs?.pval || '0';

      if (cyyzbz === '1') {
        // 允许出院但提示有未停医嘱
        const ll_count = await this.h12_yzxbRepo
          .createQueryBuilder('h12')
          .select('COUNT(*)', 'count')
          .where(
            'h12.zyid = :zyid AND h12.ysbz = 1 AND h12.jsbz <> 1 AND h12.sjbz = 1 AND h12.yzlx <> 6 AND (h12.yzlx = 1 AND (h12.tzrq IS NULL OR h12.tzrq = :empty)) AND h12.xmmc NOT IN (:...xmmcList)',
            {
              zyid: dto.zyid,
              empty: '',
              xmmcList: ['     重 整 医 嘱', '     术 后 医 嘱', '     产 后 医 嘱'],
            },
          )
          .getRawOne();

        if (parseInt(ll_count.count, 10) > 0) {
          // 在实际应用中，这里应该返回提示信息让前端显示确认对话框
          // 由于是API接口，这里直接返回成功，由前端处理确认逻辑
          this.logger.warn(`患者${dto.zyid}有未停医嘱，但允许出院`);
        }
      } else if (cyyzbz === '2') {
        // 自动停嘱
        await this.h12_yzxbRepo
          .createQueryBuilder()
          .update()
          .set({ tzrq: ldt_zksj })
          .where(
            'zyid = :zyid AND ysbz = 1 AND jsbz <> 1 AND sjbz = 1 AND yzlx <> 6 AND (yzlx = 1 AND (tzrq IS NULL OR tzrq = :empty)) AND xmmc NOT IN (:...xmmcList)',
            {
              zyid: dto.zyid,
              empty: '',
              xmmcList: ['     重 整 医 嘱', '     术 后 医 嘱', '     产 后 医 嘱'],
            },
          )
          .execute();
      }

      // 更新患者出院信息
      await this.h11BrxxRepo.update(dto.zyid, {
        cysj: ldt_zksj,
        bz2: dto.cyqk, // 出院情况
        cyzd: dto.cyzd, // 出院诊断
        zyzt: 3, // 出院状态
      });

      // 释放床位：更新床位使用信息表，将床位状态设置为空闲(1)，并清空患者信息
      await this.h13_cwsyxxRepo.update(
        { zyid: dto.zyid },
        {
          cwzt: 1, // 床位状态：1-空闲
          zyid: '', // 清空患者住院ID
          // cwfpxx: `患者${dto.zyid}于${this.formatDate(ldt_zksj, 'yyyy.mm.dd HH:MM:SS')}出院，床位已释放` // 更新床位分配信息
          cwfpxx: '', //清空床位废弃信息字段
        },
      );

      return createSuccessResponse();
    } catch (error: any) {
      this.logger.error('办理出院失败', error?.stack ?? error?.message ?? error);
      return createErrorResponse(
        error instanceof CustomException ? error.message : '办理出院失败',
        error instanceof CustomException ? error.code : ERR.ERR_10000.code,
        false, // 捕获的异常默认不需要详细表单
      );
    }
  }

  // -------------------------
  // Helper: 日期格式化
  // -------------------------
  private formatDate(date: Date, format: string): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return format
      .replace('yyyy', String(year))
      .replace('mm', month)
      .replace('dd', day)
      .replace('HH', hours)
      .replace('MM', minutes)
      .replace('SS', seconds);
  }

  // -------------------------
  // 查询该病人是否有开办理出院的医嘱
  // -------------------------
  async checkOut(dto: checkOutDto): Promise<boolean> {
    try {
      const { zyid } = dto;

      // 查询h12_yzxb表是否存在xmmc包含"出院"这两个字的医嘱项目
      const exists = await this.h12_yzxbRepo.exist({
        where: {
          zyid,
          xmmc: Like('%出院%'),
        },
      });

      return exists;
    } catch (error: any) {
      this.logger.error('查询出院医嘱失败!', error?.stack ?? error?.message ?? error);
      return false;
    }
  }

  /**
   * 生成发药单
   */
  async medicineReceipt(dto: medicineReceiptDto): Promise<void> {
    try {
      //参数校验
      if (!dto.zyid || !dto.zxhs) {
        throw new BadRequestException('患者ID或医嘱号不能为空');
      }
      // 调用发药记录的存储过程生成退费单（存储过程内部已开启事务）
      await this.dataSource.query(
        `EXEC sp_h13zxcs_fyjl  @as_ksid = @0, @li_para = @1, @ls_usid = @2, @yzlx = @3`,
        ['', dto.zyid, dto.zxhs, 0],
      );
    } catch (error: any) {
      this.logger.error('生成发药单失败', error?.stack ?? error?.message ?? error);
      throw new BadRequestException('生成发药单失败');
    }
  }

  // -------------------------
  // Helper: 尝试获取 syspar 原子锁（示例实现）
  // -------------------------
  private async tryAcquireSysparLock(): Promise<boolean> {
    // 说明：
    // 1) 如果 syspar_newService.updateNew 能在数据库层做条件更新（例如：UPDATE ... WHERE pval='0'），
    //    这里应当使用该方法并检查受影响行数来判断是否成功获取锁。
    // 2) 如果没有这样的语义，需要在数据库层实现单行条件更新或使用 DB 提供的 application lock（如 SQL Server sp_getapplock）。

    try {
      // 将标志置为 '1'，表示占用（示例调用，依赖 service 实现）
      await this.syspar_newService.updateNew(this.SYSPAR_KEY.type, this.SYSPAR_KEY.key, '1');
      return true;
    } catch (error) {
      this.logger.warn('tryAcquireSysparLock failed', (error as any)?.message ?? error);
      return false;
    }
  }

  private async releaseSysparLock(): Promise<void> {
    try {
      await this.syspar_newService.updateNew(this.SYSPAR_KEY.type, this.SYSPAR_KEY.key, '0');
    } catch (error) {
      this.logger.warn('releaseSysparLock failed', (error as any)?.message ?? error);
    }
  }

  async copyAdvice(dto: CopyAdviceDto) {
    const brxxNew = await this.h11BrxxRepo.findOne({
      where: {
        zyid: dto.zyidNew,
      },
    });

    if (!brxxNew) {
      throw new CustomException(ERR.ERR_10000, '未找到新医嘱病人信息,请检查!');
    }

    // const yzxb = await this.h12_yzxbRepo.find({
    //   where: {
    //     mxxh: In(dto.mxxh),
    //   },
    // });
    const h12_yzxbqb = this.h12_yzxbRepo
      .createQueryBuilder('h12_yzxb')
      .leftJoinAndSelect('h12_yzxb.syffidEntity', 'syffidEntity')
      .leftJoinAndSelect('h12_yzxb.syplidEntity', 'syplidEntity')
      .leftJoinAndSelect('h12_yzxb.fylbidEntity', 'fylbidEntity')
      .where('h12_yzxb.mxxh IN (:...mxxh)', { mxxh: dto.mxxh });
    const yzxb = await h12_yzxbqb.getMany();

    if (yzxb.length <= 0) {
      throw new CustomException(ERR.ERR_10000, '未找到医嘱信息,请检查!');
    }

    const yzxbGroup = await this.h12_yzxbRepo
      .createQueryBuilder('yzxb')
      .select('yzxb.yzzh', 'yzzh')
      .where('yzxb.mxxh IN (:...mxxh)', { mxxh: dto.mxxh })
      .groupBy('yzxb.yzzh')
      .getRawMany();

    for (let i = 0; i < yzxbGroup.length; i++) {
      const yzzh = await this.gyIdentityService.getMax('h12_yzzh');
      await Promise.all(
        yzxb.map(async (item) => {
          if (item.yzzh === yzxbGroup[i].yzzh) {
            item.yzzh = yzzh;
          }
          item.mxxh = await this.gyIdentityService.getMax('h12_yzxbn');
          item.zybh = brxxNew.zybh;
          item.zycs = brxxNew.zycs;
          item.ksys = '';
          item.kshs = '';
          item.ksnf = '';
          item.ksrq = '';
          item.kssj = '';
          item.jsys = '';
          item.jshs = '';
          item.jsrq = '';
          item.jsnf = '';
          item.jsrq = '';
          item.jssj = '';
          item.jsbz = 0;
          item.hdhs = '';
          item.hshd = '';
          item.hshdrq = null;
          item.hdbz = 0;
          item.lryid = '';
          item.tzbz = 0;
          item.tzrq = null;
          item.zxrq = null;
          //item.ysbz = 0;
          item.yzzt = 0;
          item.zxcs = 0;
          item.yzrq = new Date();
          item.kssxys = '';
          item.kssxhs = '';
          item.jssxys = '';
          item.jssxhs = '';
          item.zxhs = '';
          item.zxsj = null;
        }),
      );
    }

    return yzxb;
  }

  /**
   * 复核退回
   *
   * @param dto
   * @param user
   * @param info
   */
  async reviewBack(dto: { zyid: string; yzlx: number; mxxh: number[]; info: string }, user: any) {
    // 检查是否执行有费用，有费用不允许退回，另外状态也必须在2, 5, 6中
    const yzzxcs = await this.h13_yzzxcsRepo.find({
      where: {
        zyid: dto.zyid,
        yzlx: dto.yzlx,
        mxxh: In(dto.mxxh),
        zxcs: Raw((zxcs) => `${zxcs} > bzxcs`),
      },
    });
    if (yzzxcs.length > 0) {
      throw new CustomException(ERR.ERR_40203);
    }

    // 如果新提交医嘱，则直接退回不提单状态，让医生可以修改
    await this.h12_yzxbRepo.update(
      { zyid: dto.zyid, yzlx: dto.yzlx, mxxh: In(dto.mxxh), yzzt: 1 },
      { yzzt: 7, tjbz: 0, hdbz: 0, kssxhs: null, kshs: null },
    );
    await this.h12_yzxbRepo.update(
      { zyid: dto.zyid, yzlx: dto.yzlx, mxxh: In(dto.mxxh), yzzt: In([2, 5, 6]) },
      { yzzt: 7, hdbz: 0, kssxhs: null, kshs: null },
    );
  }

  /**
   * 停嘱退回
   * @param dto
   * @param user
   * @param info
   */
  async stopBack(dto: { zyid: string; yzlx: number; mxxh: number[]; info: string }, user: any) {
    // 只更新停嘱提交数据，其他数据不更新
    await this.h12_yzxbRepo.update(
      { zyid: dto.zyid, yzlx: dto.yzlx, mxxh: In(dto.mxxh), yzzt: In([5, 6]) },
      { yzzt: 7, jssxhs: null, jshs: null },
    );
  }
}
