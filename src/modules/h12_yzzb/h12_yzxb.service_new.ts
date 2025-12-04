import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { h12_yzzb } from './h12_yzzb.entity';
import { h12_yzxb } from './h12_yzxb.entity';
import { GyIdentityService } from '../gy_identity/gy-identity.service';
import { executeDto, adviceDto, reviewDto, outDto, checkOutDto } from './dto/h12_yzzbOpe.dto';
import { CustomException } from '@/common/exceptions/custom.exception';
import { ERR } from '@/common/exceptions/error-code';
import { syspar_newService } from '../syspar_new/syspar_new.service';
import { H13YzzxcsTf } from '../h13_yzzxcs_tf/h13-yzzxcs-tf.entity';
import { h13_yzzxcs } from '../​​h13_yzzxcs​​/h13_yzzxcs.entity';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';
import { h13_cwsyxx } from '../h13_cwsyxx/h13_cwsyxx.entity';
import { ConfigReaderService } from '../h12_xmzd/service/config-reader.service';

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
    @InjectRepository(h11_brxx)
    private h11BrxxRepo: Repository<h11_brxx>,
    @InjectRepository(h13_cwsyxx)
    private h13_cwsyxxRepo: Repository<h13_cwsyxx>,
    private readonly gyIdentityService: GyIdentityService,
    private dataSource: DataSource,
    private readonly syspar_newService: syspar_newService,
    private readonly configReaderService: ConfigReaderService,
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
            hdbz: 0,
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
          where: { zyid, yzlx: In([1, 2, 7]), yzzt: 1 },
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
            throw new CustomException(
              ERR.ERR_10000,
              `[${item.xmidEntity.xmmc}] 未发药，请走删除费用流程!`,
            );
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
      select: { h13_yzzxcsList: true },
      relations: { h13_yzzxcsList: true }
    })
    for (const item of yzxbList) {
      if (item?.h13_yzzxcsList?.length) {
        throw new CustomException(ERR.ERR_10000, `[${item.xmmc}] 已执行，不能退回`);
      }
      item.yzzt = 0
      item.tjbz = 0
      item.kshs = ''
      item.zxbz = 0
      item.hdbz = 0
      item.zxrq = null
      item.hshd = ''
    }
    await this.h12_yzxbRepo.save(yzxbList)
    return true
  }

  // -------------------------
  // 办理出院
  // -------------------------
  async out(dto: outDto): Promise<{ success: boolean; message?: string }> {
    try {
      // 接收出院时间并格式化
      const ldt_zksj = new Date(dto.cysj);
      const ls_sj = this.formatDate(ldt_zksj, 'yyyy.mm.dd');

      // 获取入院时间并格式化
      const brxx = await this.h11BrxxRepo.findOne({
        where: { zyid: dto.zyid },
        select: ['rysj']
      });

      if (!brxx || !brxx.rysj) {
        throw new CustomException(ERR.ERR_10000, '未找到患者入院信息');
      }

      const ldt_rysj = new Date(brxx.rysj);
      ldt_rysj.setHours(0, 0, 0, 0); // 设置时间为00:00:00
      const ls_rq = this.formatDate(ldt_rysj, 'yyyy.mm.dd');

      // 校验：医嘱执行时间早于入院日期
      const li_rycount = await this.h13_yzzxcsRepo.createQueryBuilder('h13')
        .select('COUNT(*)', 'count')
        .where('h13.zyid = :zyid AND h13.zxrq < :rysj', {
          zyid: dto.zyid,
          rysj: ldt_rysj
        })
        .getRawOne();

      if (parseInt(li_rycount.count, 10) > 0) {
        throw new CustomException(ERR.ERR_10000, `执行时间小于入院日期"${ls_rq}"，请删除多余次数后出院!`);
      }

      // 校验：医嘱执行时间晚于出院日期
      const li_yzzxcscount = await this.h13_yzzxcsRepo.createQueryBuilder('h13')
        .select('COUNT(*)', 'count')
        .where('h13.zyid = :zyid AND h13.zxrq > :zksj', {
          zyid: dto.zyid,
          zksj: ldt_zksj
        })
        .getRawOne();

      if (parseInt(li_yzzxcscount.count, 10) > 0) {
        throw new CustomException(ERR.ERR_10000, '执行时间大于出院时间，请删除多余次数后出院!');
      }

      // 未发药校验 - 获取系统参数
      const { xyksid, cyksid, zyksid, clksid, qtksid, zjksid, ssclksid, jpksid, hlksid }
        = await this.configReaderService.readYfCxsz(brxx.cyksid);
      // console.log('--------------', xyksid, cyksid, zyksid, clksid, qtksid, zjksid, ssclksid, jpksid, hlksid)
      throw new CustomException(ERR.ERR_10000, '有医嘱未复核，请复核后再出院!');
      // const ksidList = [
      //   gs_cxsz.xyksid,
      //   gs_cxsz.cyksid,
      //   gs_cxsz.zyksid,
      //   gs_cxsz.clksid,
      //   gs_cxsz.qtksid,
      //   gs_cxsz.zjksid
      // ].filter(Boolean);
      // //控制台打印 ksidList
      // console.log('ksidList: ', ksidList);
      // 1. 校验h13_yzzxcs和h12_yzxb表中未发药记录
      const ll_count1 = await this.h13_yzzxcsRepo.createQueryBuilder('h13')
        .innerJoin('h12_yzxb', 'h12', 'h13.yzxh = h12.yzxh AND h13.yzlx = h12.yzlx AND h13.zyid = h12.zyid AND h13.mxxh = h12.mxxh')
        .select('COUNT(*)', 'count')
        .where('h13.zyid = :zyid', { zyid: dto.zyid })
        .andWhere('(ISNULL(h13.fybz, 0) <> 1)')
        .andWhere('(h12.xmzl = 2 OR h12.xmzl = 3)')
        .andWhere('(h13.zxcs - h13.bzxcs) > 0')
        .andWhere('h13.jfyl > 0')
        .andWhere('h13.zkksid IN (:...ksidList)', {
          ksidList: [
            xyksid, cyksid, zyksid, clksid, qtksid, zjksid, ssclksid,
            jpksid, hlksid
            // gs_cxsz.jpksid,
            // gs_cxsz.hlksid
          ].filter(Boolean)
        })
        .getRawOne();
      //控制台输出 校验药品未发药记录的实际sql
      console.log("校验药品未发药记录的实际sql:", ll_count1);

      if (parseInt(ll_count1.count, 10) > 0) {
        throw new CustomException(ERR.ERR_10000, '有药品未发药，不能办理出院');
      }

      // 2. 校验h13_yzzxcs_tf和h12_yzxb表中未发药的退费记录
      const ll_count2 = await this.dataSource.createQueryBuilder()
        .select('COUNT(*)', 'count')
        .from('h13_yzzxcs_tf', 'h13tf')
        .innerJoin('h12_yzxb', 'h12', 'h13tf.yzxh = h12.yzxh AND h13tf.yzlx = h12.yzlx AND h13tf.zyid = h12.zyid AND h13tf.mxxh = h12.mxxh')
        .where('h13tf.zyid = :zyid', { zyid: dto.zyid })
        .andWhere('(ISNULL(h13tf.fybz, 0) <> 1)')
        .andWhere('(h12.xmzl = 2 OR h12.xmzl = 3)')
        .andWhere('ABS(h13tf.zxcs - h13tf.bzxcs) > 0')
        .andWhere('h13tf.jfyl > 0')
        .andWhere('h13tf.zkksid IN (:...ksidList)', {
          ksidList: [
            xyksid, cyksid, zyksid, clksid, qtksid, zjksid, ssclksid,
            jpksid, hlksid
          ].filter(Boolean)
        })
        .getRawOne();
      //控制台输出 校验药品退费未发药记录的实际sql
      console.log("校验药品退费未发药记录的实际sql:", ll_count2);

      if (parseInt(ll_count2.count, 10) > 0) {
        throw new CustomException(ERR.ERR_10000, '有药品退费未发药，不能办理出院');
      }

      // 3. 校验手术医嘱未发药记录
      const ll_count3 = await this.dataSource.createQueryBuilder()
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
            xyksid, cyksid, zyksid, clksid, qtksid, zjksid, ssclksid,
            jpksid, hlksid
          ].filter(Boolean)
        })
        .getRawOne();
      //控制台输出 校验手术医嘱未发药记录的实际sql
      console.log("校验手术医嘱未发药记录的实际sql:", ll_count3);

      if (parseInt(ll_count3.count, 10) > 0) {
        throw new CustomException(ERR.ERR_10000, '手术医嘱未发药不能办出院');
      }

      // 校验：实习医生未签名
      const li_jmcount1 = await this.h12_yzxbRepo.createQueryBuilder('h12')
        .select('COUNT(*)', 'count')
        .where('h12.zyid = :zyid AND (h12.yzlx = 1 OR h12.yzlx = 2) AND h12.ysbz = 1 AND h12.jsbz <> 1 AND h12.sjbz = 1 AND (h12.ksys = :empty OR h12.ksys IS NULL) AND h12.xmid <> :xmid', {
          zyid: dto.zyid,
          empty: '',
          xmid: '0000000'
        })
        .getRawOne();

      if (parseInt(li_jmcount1.count, 10) > 0) {
        throw new CustomException(ERR.ERR_10000, '实习医生未签名，请医生签名后再出院!');
      }

      // 校验：医嘱未复核
      const li_jmcount2 = await this.h12_yzxbRepo.createQueryBuilder('h12')
        .select('COUNT(*)', 'count')
        .where('h12.zyid = :zyid AND h12.ysbz = 1 AND h12.jsbz <> 1 AND h12.sjbz = 1 AND h12.yzlx <> 6 AND (h12.hdbz = 0 OR (h12.yzlx = 1 AND h12.tzbz = 1 AND (h12.jshs = :empty OR h12.jshs IS NULL))) AND h12.xmid <> :xmid', {
          zyid: dto.zyid,
          empty: '',
          xmid: '0000000'
        })
        .getRawOne();

      if (parseInt(li_jmcount2.count, 10) > 0) {
        throw new CustomException(ERR.ERR_10000, '有医嘱未复核，请复核后再出院!');
      }

      // 校验：护士未签名
      const li_jmcount3 = await this.h12_yzxbRepo.createQueryBuilder('h12')
        .select('COUNT(*)', 'count')
        .where('h12.zyid = :zyid AND (h12.yzlx = 1 OR h12.yzlx = 2) AND h12.ysbz = 1 AND h12.jsbz <> 1 AND h12.sjbz = 1 AND (h12.kshs = :empty OR h12.kshs IS NULL) AND h12.xmid <> :xmid', {
          zyid: dto.zyid,
          empty: '',
          xmid: '0000000'
        })
        .getRawOne();

      if (parseInt(li_jmcount3.count, 10) > 0) {
        throw new CustomException(ERR.ERR_10000, '开始护士未签名，请护士签名后再出院!');
      }


      // 校验：未执行项目
      // 从系统参数获取未执行项目分类
      const gsCxsz = await this.syspar_newService.findOne('99', 'yjzxsflb');
      if (gsCxsz && gsCxsz.pval && gsCxsz.pval.trim().length > 0) {
        const fylbidList = gsCxsz.pval.split(',').map(id => id.trim());

        const li_yzzxcscount = await this.h13_yzzxcsRepo.createQueryBuilder('h13')
          .select('COUNT(*)', 'count')
          .where('h13.zyid = :zyid AND h13.sfbz = 0 AND h13.xmdj > 0 AND h13.fylbid IN (:...fylbidList)', {
            zyid: dto.zyid,
            fylbidList
          })
          .getRawOne();

        if (parseInt(li_yzzxcscount.count, 10) > 0) {
          throw new CustomException(ERR.ERR_10000, '该病人有项目未执行，请医技科室执行后再出院！');
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
        const ll_count = await this.h12_yzxbRepo.createQueryBuilder('h12')
          .select('COUNT(*)', 'count')
          .where('h12.zyid = :zyid AND h12.ysbz = 1 AND h12.jsbz <> 1 AND h12.sjbz = 1 AND h12.yzlx <> 6 AND (h12.yzlx = 1 AND (h12.tzrq IS NULL OR h12.tzrq = :empty)) AND h12.xmmc NOT IN (:...xmmcList)', {
            zyid: dto.zyid,
            empty: '',
            xmmcList: ['     重 整 医 嘱', '     术 后 医 嘱', '     产 后 医 嘱']
          })
          .getRawOne();

        if (parseInt(ll_count.count, 10) > 0) {
          // 在实际应用中，这里应该返回提示信息让前端显示确认对话框
          // 由于是API接口，这里直接返回成功，由前端处理确认逻辑
          this.logger.warn(`患者${dto.zyid}有未停医嘱，但允许出院`);
        }
      } else if (cyyzbz === '2') {
        // 自动停嘱
        await this.h12_yzxbRepo.createQueryBuilder()
          .update()
          .set({ tzrq: ldt_zksj })
          .where('zyid = :zyid AND ysbz = 1 AND jsbz <> 1 AND sjbz = 1 AND yzlx <> 6 AND (yzlx = 1 AND (tzrq IS NULL OR tzrq = :empty)) AND xmmc NOT IN (:...xmmcList)', {
            zyid: dto.zyid,
            empty: '',
            xmmcList: ['     重 整 医 嘱', '     术 后 医 嘱', '     产 后 医 嘱']
          })
          .execute();
      }

      // 更新患者出院信息
      await this.h11BrxxRepo.update(dto.zyid, {
        cysj: ldt_zksj,
        bz2: dto.cyqk,  // 出院情况
        cyzd: dto.cyzd, // 出院诊断
        zyzt: 3         // 出院状态
      });

      // 释放床位：更新床位使用信息表，将床位状态设置为空闲(1)，并清空患者信息
      await this.h13_cwsyxxRepo.update({ zyid: dto.zyid }, {
        cwzt: 1,       // 床位状态：1-空闲
        zyid: '',      // 清空患者住院ID
        // cwfpxx: `患者${dto.zyid}于${this.formatDate(ldt_zksj, 'yyyy.mm.dd HH:MM:SS')}出院，床位已释放` // 更新床位分配信息
        cwfpxx: ''   //清空床位废弃信息字段
      });

      return { success: true };
    } catch (error: any) {
      this.logger.error('办理出院失败', error?.stack ?? error?.message ?? error);
      return {
        success: false,
        message: error instanceof CustomException ? error.message : '办理出院失败'
      };
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

      // 查询h12_yzxb表是否存在xmid为0000000的医嘱项目
      const exists = await this.h12_yzxbRepo.exist({
        where: {
          zyid,
          xmid: '0000000'
        }
      });

      return exists;
    } catch (error: any) {
      this.logger.error('该病人出院诊断未写，不能办理出院!', error?.stack ?? error?.message ?? error);
      return false;
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
}
