import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { h12_yzzb } from './h12_yzzb.entity';
import { h12_yzxb } from './h12_yzxb.entity';
import { GyIdentityService } from '../gy_identity/gy-identity.service';
import { executeDto, adviceDto, reviewDto } from './dto/h12_yzzbOpe.dto';
import { CustomException } from '@/common/exceptions/custom.exception';
import { ERR } from '@/common/exceptions/error-code';
import { syspar_newService } from '../syspar_new/syspar_new.service';
import { H13YzzxcsTf } from '../h13_yzzxcs_tf/h13-yzzxcs-tf.entity';
import { h13_yzzxcs } from '../​​h13_yzzxcs​​/h13_yzzxcs.entity';

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

enum Zxbz {
  DEFAULT = '10',
  MXXH = '9',
  PARTIAL = '5',
  SPECIAL = '3',
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
    private readonly gyIdentityService: GyIdentityService,
    private dataSource: DataSource,
    private readonly syspar_newService: syspar_newService,
  ) { }

  // 取组套（保留入口，按需实现）
  async addPackageToAdvice(): Promise<void> {
    // TODO: implement
  }

  // -------------------------
  // 护士复核医嘱
  // -------------------------
  async review(dto: reviewDto): Promise<void> {
    try {
      const [yzzb, yzxbList] = await Promise.all([
        this.h12_yzzbRepo.findOne({
          where: { zyid: dto.zyid, yzlx: dto.yzlx, yzxh: 1 },
        }),
        this.h12_yzxbRepo.find({
          where: {
            zyid: dto.zyid,
            yzlx: dto.yzlx,
            yzxh: In(dto.yzxh || []),
            mxxh: In(dto.mxxh || []),
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

      // 批量修改并保存
      yzxbList.forEach((yzxb) => {
        yzxb.kshs = dto.kshs;
        yzxb.hshd = dto.kshs;
        yzxb.hdbz = 1;
        yzxb.yzzt = 1;
        if (dto.yzlx === 2) {
          if (!yzxb.tzrq) yzxb.tzrq = dto.rq;
          yzxb.jshs = dto.jshs;
        }
        if (dto.yzlx === 1 && yzzb?.tzsj) {
          if (!yzxb.tzrq) yzxb.tzrq = dto.rq;
          yzxb.jshs = dto.jshs;
        }
      });

      if (yzxbList.length) await this.h12_yzxbRepo.save(yzxbList);
    } catch (error: any) {
      this.logger.error('复核医嘱失败', error?.stack ?? error?.message ?? error);
      throw new CustomException(ERR.ERR_10000, error?.message ?? '复核医嘱失败');
    }
  }

  // -------------------------
  // 护士执行医嘱
  // -------------------------
  async execute(dto: executeDto): Promise<void> {
    let lockAcquired = false;
    try {
      // 参数解构与校验
      const {
        zxhs,
        zxks,
        zyid,
        beginDate,
        endDate,
        newYear = '',
        medicine = '',
        mxxh,
      } = dto;

      if (!zyid) throw new CustomException(ERR.ERR_10000, '缺少住院ID');

      let executeType: string | number = dto.executeType;
      let zxbz = DEFAULT_ZXBZ;

      // 加载必要的数据用于校验
      const [yzzb, yzxbList] = await Promise.all([
        this.h12_yzzbRepo.findOne({ where: { zyid, yzlx: In([1, 2, 7]), yzxh: 1 } }),
        this.h12_yzxbRepo.find({
          where: { zyid, yzlx: In([1, 2, 7]) },
          select: [
            'kshs',
            'hdhs',
            'hshdrq',
            'zyid',
            'yzlx',
            'yzxh',
            'mxxh',
            'hshd',
            'hdbz',
            'jshs',
            'tzrq',
            'xmmc',
          ],
        }),
      ]);

      // 执行类型处理
      if (executeType === '0') {
        executeType = EXECUTE_TYPE_WILDCARD;
        const notReviewedIndex = yzxbList.findIndex((item) => !item.kshs);
        if (notReviewedIndex !== -1) {
          const xmmc = yzxbList[notReviewedIndex].xmmc;
          throw new CustomException(ERR.ERR_10000, `[${xmmc}] 未复核,请先复核医嘱`);
        }
      }

      if (executeType === '101') {
        executeType = String(mxxh);
        zxbz = Zxbz.MXXH;
      }
      if (executeType === '102') {
        executeType = EXECUTE_TYPE_WILDCARD;
        zxbz = Zxbz.PARTIAL;
      }
      if (executeType === '103') {
        executeType = EXECUTE_TYPE_WILDCARD;
        zxbz = Zxbz.SPECIAL;
      }

      // 执行存储过程
      await this.dataSource.query(
        `EXEC sp_h13hdzx_zyzx  @zxbz = @0, @li_para = @1, @ls_depart = @2, @ldt_begin = @3,
          @ldt_end = @4, @ls_man = @5, @ls_yzlx = @6`,
        [zxbz, zyid, zxks, beginDate, endDate, zxhs, executeType],
      );

      // 如果需要生成发药记录，检查并设置并发标志（示例）
      if (medicine === '1') {
        // 尝试加锁（使用 service 的 manager 版本以支持事务，如果你的 syspar_newService 支持 manager 传参）
        const syspar = await this.syspar_newService.findNewOne(this.SYSPAR_KEY.type, this.SYSPAR_KEY.key);
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
          if (lockAcquired) await this.releaseSysparLock().catch((e) => this.logger.warn('释放syspar锁失败', e));
        }
      }
    } catch (error: any) {
      this.logger.error('执行医嘱失败', error?.stack ?? error?.message ?? error);
      throw new CustomException(ERR.ERR_10000, error?.message ?? '执行医嘱失败');
    }
  }

  // -------------------------
  // 删除医嘱费用
  // -------------------------
  async deleteCost(dto: adviceDto): Promise<void> {
    if (!dto?.mxxhList?.length) return;

    const mxxhArray = dto.mxxhList.map((it) => it.mxxh).filter(Boolean);
    if (!mxxhArray.length) return;

    await this.dataSource.transaction(async (manager) => {
      try {
        // 并发标志检查（使用 manager 版的查找，以保证校验在事务内）
        const syspar_new = await this.syspar_newService.findNewOne(this.SYSPAR_KEY.type, this.SYSPAR_KEY.key, manager);
        if (syspar_new?.pval === '1') {
          throw new CustomException(ERR.ERR_10000, '正在执行生成发药，请稍等！');
        }

        const h13Repo = manager.getRepository(h13_yzzxcs);

        const h13_yzzxcsList = await h13Repo.createQueryBuilder('h13_yzzxcs')
          .leftJoin('h13_yzzxcs.xmidEntity', 'xmidEntity')
          .addSelect(['xmidEntity.xmid', 'xmidEntity.xmmc', 'xmidEntity.ggxh', 'xmidEntity.xmzl'])
          .leftJoin('h13_yzzxcs.H31Lyjl', 'H31Lyjl')
          .addSelect(['H31Lyjl.djbh', 'H31Lyjl.tjbz', 'H31Lyjl.zyid', 'H31Lyjl.ckclbz', 'H31Lyjl.ksid', 'H31Lyjl.fhksid'])
          .leftJoin('h13_yzzxcs.H13YzzxcsTfList', 'H13YzzxcsTfList')
          .addSelect(['H13YzzxcsTfList.zxcs', 'H13YzzxcsTfList.yzxh', 'H13YzzxcsTfList.mxxh',
            'H13YzzxcsTfList.fybz', 'H13YzzxcsTfList.fydh', 'H13YzzxcsTfList.yzlx', 'H13YzzxcsTfList.zyid', 'H13YzzxcsTfList.zxcs2'])
          .where('h13_yzzxcs.zyid = :zyid and h13_yzzxcs.yzlx=:yzlx and h13_yzzxcs.mxxh IN (:...mxxhList)', {
            zyid: dto.zyid,
            yzlx: dto.yzlx || '',
            mxxhList: mxxhArray,
          }).getMany();

        if (!h13_yzzxcsList.length) return;

        // 校验业务规则
        for (const item of h13_yzzxcsList) {
          if (item.bzxcs !== item.zxcs && item.xmidEntity.xmzl !== 1 && item?.H31Lyjl?.ckclbz === 1) {
            throw new CustomException(ERR.ERR_10000, `[${item.xmidEntity.xmmc}] 已发药，请走退费流程!`);
          }
          if (item.bzxcs !== item.zxcs && item.xmidEntity.xmzl !== 1 && item.fydh) {
            throw new CustomException(ERR.ERR_10000, `[${item.xmidEntity.xmmc}] 已生成领药单，请发药科室退回单号【${item.fydh}】才可以删除!`);
          }

          const H13YzzxcsTfList = item.H13YzzxcsTfList ?? [];
          const index = H13YzzxcsTfList.findIndex((tf) => tf.fybz === 0);
          if (index !== -1 && item.fydh) {
            throw new CustomException(ERR.ERR_10000, `退药单 [${H13YzzxcsTfList[index].fydh}] 未执行退药`);
          }

          const bzxcs = H13YzzxcsTfList.reduce((val, tf) => val + (tf.zxcs ?? 0), 0);
          if (item.zxcs + bzxcs !== 0 && item.fydh) {
            throw new CustomException(ERR.ERR_10000, `单号 [${item.fydh}] 未退完全部执行次数`);
          }

          if (item.bzxcs !== item.zxcs && item.xmidEntity.xmzl === 1 && item.clbz === 1) {
            throw new CustomException(ERR.ERR_10000, `[${item.xmidEntity.xmmc}] 已执行，不能删除`);
          }
        }

        // 删除费用
        await h13Repo.delete({
          zyid: dto.zyid,
          yzlx: dto.yzlx,
          mxxh: In(h13_yzzxcsList.map((it) => it.mxxh)),
        });
      } catch (error: any) {
        this.logger.error('删除费用失败', error?.stack ?? error?.message ?? error);
        throw new CustomException(ERR.ERR_10000, error?.message ?? '删除费用失败');
      }
    });
  }

  // -------------------------
  // 退费医嘱费用
  // -------------------------
  async refundCost(dto: adviceDto): Promise<void> {
    if (!dto?.mxxhList?.length) return;

    const mxxhArray = dto.mxxhList.map((it) => it.mxxh).filter(Boolean);
    if (!mxxhArray.length) return;

    await this.dataSource.transaction(async (manager) => {
      try {
        const syspar_new = await this.syspar_newService.findNewOne(this.SYSPAR_KEY.type, this.SYSPAR_KEY.key, manager);
        if (syspar_new?.pval === '1') {
          throw new CustomException(ERR.ERR_10000, '正在执行生成发药，请稍等！');
        }

        const h13Repo = manager.getRepository(h13_yzzxcs);
        const H13YzzxcsTfRepo = manager.getRepository(H13YzzxcsTf);

        const h13_yzzxcsList = await h13Repo.createQueryBuilder('h13_yzzxcs')
          .leftJoin('h13_yzzxcs.xmidEntity', 'xmidEntity')
          .addSelect(['xmidEntity.xmid', 'xmidEntity.xmmc', 'xmidEntity.ggxh', 'xmidEntity.xmzl'])
          .leftJoin('h13_yzzxcs.H31Lyjl', 'H31Lyjl')
          .addSelect(['H31Lyjl.zyid', 'H31Lyjl.djbh', 'H31Lyjl.tjbz', 'H31Lyjl.ckclbz', 'H31Lyjl.ksid', 'H31Lyjl.fhksid'])
          .where('h13_yzzxcs.zyid = :zyid and h13_yzzxcs.yzlx=:yzlx and h13_yzzxcs.mxxh IN (:...mxxhList)', {
            zyid: dto.zyid,
            yzlx: dto.yzlx || '',
            mxxhList: mxxhArray,
          }).getMany();

        if (!h13_yzzxcsList.length) return;

        const tfListToInsert: H13YzzxcsTf[] = [];

        for (const item of h13_yzzxcsList) {
          if (item.xmidEntity.xmzl === 1 && item.clbz === 1) {
            throw new CustomException(ERR.ERR_10000, `[${item.xmidEntity.xmmc}] 已执行，不能退费`);
          }
          if (item.xmidEntity.xmzl !== 1 && item?.H31Lyjl?.ckclbz !== 1) {
            throw new CustomException(ERR.ERR_10000, `[${item.xmidEntity.xmmc}] 未发药，请走删除费用流程!`);
          }

          const dtoItem = dto.mxxhList.find((d) => d.mxxh === item.mxxh);
          if (!dtoItem) throw new CustomException(ERR.ERR_10000, '请求参数与数据库数据不匹配');

          if (dtoItem.bzxcs > item.zxcs || dtoItem.bzxcs <= 0) {
            throw new CustomException(ERR.ERR_10000, `[${item.xmidEntity.xmmc}] 不执行次数不能大于执行次数 且不能小于0!`);
          }

          tfListToInsert.push({
            ...item,
            czrq: new Date(),
            zxrq: new Date(),
            fydh: '',
            zxcs2: item.maxid,
            zxhs: dto.zxhs,
            zxcs: -1 * dtoItem.bzxcs,
            bzxcs: 0,
            tyrid: dto.zxhs,
            tysj: new Date(),
            sysj: null,
            clbz: 0,
            fybz: 0,
          } as any);

          // 修改主记录的已退次数
          item.bzxcs = dtoItem.bzxcs;
          item.H31Lyjl = undefined as any;
          item.H13YzzxcsTfList = undefined as any;
        }

        await Promise.all([
          h13Repo.save(h13_yzzxcsList),
          H13YzzxcsTfRepo.save(tfListToInsert),
        ]);

        // 调用发药记录的存储过程生成退费单
        await manager.query(
          `EXEC sp_h13zxcs_fyjl  @as_ksid = @0, @li_para = @1, @ls_usid = @2, @yzlx = @3`,
          ['', dto.zyid, dto.zxhs, 0],
        );
      } catch (error: any) {
        this.logger.error('退费失败', error?.stack ?? error?.message ?? error);
        throw new CustomException(ERR.ERR_10000, error?.message ?? '删除费用失败');
      }
    });
  }

  // -------------------------
  // 退回医嘱给医生
  // -------------------------
  async refundAdvice(dto: adviceDto) {
    const yzxbList = await this.h12_yzxbRepo.find({
      where: {
        zyid: dto.zyid,
        yzlx: dto.yzlx,
        ysbz: 1,
        yzxh: 1,
        mxxh: In(dto.mxxhList || []),
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
        'h13_yzzxcsList'
      ],
    })
    for (const item of yzxbList) {
      if (item?.h13_yzzxcsList?.length) {
        throw new CustomException(ERR.ERR_10000, `[${item.xmmc}] 已执行，不能退回`);
      }
      item.yzzt = 0
      item.tjbz = 0
    }
    await this.h12_yzxbRepo.save(yzxbList)
    return true
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
}
