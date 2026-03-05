import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, DeleteResult, EntityManager, In } from 'typeorm';
import { H15Ssxb } from './h15-ssxb.entity';
import {
  CreateH15SsxbDto,
  H15SsxbBatchDto,
  QueryH15SsxbDto,
  UpdateH15SsxbDto,
} from './dto/h15-ssxb.dto';
import { H15Sszb } from '../h15_sszb/h15-sszb.entity';
import { SmSssq } from '../sm-sssq/sm-sssq.entity';
import { GyIdentityService } from '../gy_identity/gy-identity.service';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';
import { CustomException, ErrorCode } from '@/common/exceptions/custom.exception';
import { parse } from 'path';
import { ParamService } from '../h12_xmzd/service/param.service';

@Injectable()
export class H15SsxbService {
  constructor(
    @InjectRepository(H15Sszb)
    private readonly h15SszbRepository: Repository<H15Sszb>,

    @InjectRepository(SmSssq)
    private readonly smSssqRepository: Repository<SmSssq>,

    @InjectRepository(H15Ssxb)
    private readonly h15SsxbRepository: Repository<H15Ssxb>,

    @InjectRepository(h11_brxx)
    private readonly h11BrxxRepository: Repository<h11_brxx>,

    private readonly gyIdentityService: GyIdentityService,
    private readonly entityManager: EntityManager,
    private readonly paramService: ParamService,
  ) {}

  /**
   * 创建收费明细
   */
  async create(createDto: UpdateH15SsxbDto, manager: EntityManager): Promise<H15Ssxb> {
    createDto.ypdh = (await this.gyIdentityService.getMax('h15_ssxb_ypdh')).toString();
    return await manager.save(H15Ssxb, createDto);
  }

  async saveSsxb(ssxb: H15SsxbBatchDto, manager: EntityManager): Promise<void> {
    try {
      // 检查主表是否存在，不存在则创建主表记录
      const smSssq = await this.smSssqRepository.findOne({
        where: { sqdh: parseInt(ssxb.sqdh) },
      });
      const { zyid, ssrq, ssnm, mzys, ssys } = smSssq;
      const h11Brxx = await this.h11BrxxRepository.findOne({
        where: { zyid },
      });

      const h15Sszb = await manager.findOne(H15Sszb, {
        where: { sqdh: parseInt(ssxb.sqdh) },
      });
      let ssid = '0';
      if (!h15Sszb) {
        ssid = (await this.gyIdentityService.getMax('h15_sszb')).toString();
        const newH15Sszb = this.h15SszbRepository.create({
          ssid,
          zyid,
          xh: 1,
          brxm: h11Brxx.brxm,
          zybh: h11Brxx.zybh,
          //   brlx: h11Brxx.brlxid,
          brlx: '0',
          fyksid: h11Brxx.cyksid ?? h11Brxx.ryksid,
          sqdh: parseInt(ssxb.sqdh),
          ssrq,
          ksid: h11Brxx.cyksid,
          nl: parseInt(h11Brxx.brnl),
          cwid: h11Brxx.cycw,
          xbid: h11Brxx.xbid,
          ssmc: ssnm,
          lryid: ssxb.userId,
          sslb: 0,
          ssxz: 0,
          jsbz: 0,
          ssysid: ssys,
          ysid: mzys,
        });
        await manager.save(H15Sszb, newH15Sszb);
      } else ssid = h15Sszb.ssid;
      for (const [index, item] of ssxb.items.entries()) {
        item.ssmxid = index + 1;
        item.xh = index + 1;
        item.ssid = ssid;
        item.zyid = h11Brxx.zyid;
        if (!item.ypdh) await this.create(item, manager);
        else await this.update(item, manager);
      }
      await manager.delete(H15Ssxb, { maxid: In(ssxb.deleteItems) });
    } catch (error) {
      console.error('提交手术明细失败:', error);
      throw new CustomException(ErrorCode.ERR_40900);
    }
  }

  /**
   * 批量创建收费明细
   */
  async batchSave(ssxb: H15SsxbBatchDto): Promise<void> {
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      await this.saveSsxb(ssxb, transactionalEntityManager);
    });
  }

  /**
   * 提交手术细表并处理库存
   */
  async submitSurgeryDetail(ssxb: H15SsxbBatchDto): Promise<void> {
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      try {
        // 获取细表记录
        const details = ssxb.items;
        const kssz = await this.paramService.gfGetPara(30, 'yzkssz', '0', '医嘱科室发药');

        for (const detail of details) {
          // 跳过已提交或已退票的记录
          if (detail.tjbz === 1 || detail.tpbz === 1) {
            continue;
          }

          // 检查护士签名
          if (!detail.kshs) {
            throw new Error('护士未签名医嘱，不能提交！');
          }

          // 如果是治疗类项目，直接标记为已提交
          if (detail.xmzl === 1) {
            detail.tjbz = 1;
            continue;
          }

          // 查询药品信息
          const medicine = await transactionalEntityManager.query(
            `SELECT isnull(jsl2,0) as jsl2, ysxs FROM h30_ypzd WHERE ypid = @0`,
            [detail.xmid],
          );

          if (!medicine || medicine.length === 0) {
            continue;
          }

          // 如果需要管理库存
          if (medicine[0].jsl2 === 0) {
            // 检查库存
            const stock = await transactionalEntityManager.query(
              `SELECT isnull((xsl),0) - isnull(dfsl,0) - isnull(mzdfsl,0) - isnull(ssdfsl,0) as kcsl
             FROM h31_kcxx
             WHERE ksid = @0 AND ypid = @1 AND scph = @2`,
              [detail.zxksid, detail.xmid, detail.scph],
            );

            if (stock[0].kcsl <= 0 || stock[0].kcsl < detail.jfyl) {
              // 查找其他批次的库存
              const otherStock = await transactionalEntityManager.query(
                `SELECT TOP 1 scph, scpc, lsjg, pfjg
               FROM h31_kcxx
               WHERE ksid = @0 AND ypid = @1
               AND isnull(xsl,0) - isnull(dfsl,0) - isnull(mzdfsl,0) - isnull(ssdfsl,0) - @2 >= 0`,
                [detail.zxksid, detail.xmid, detail.jfyl],
              );

              if (!otherStock || otherStock.length === 0) {
                throw new Error(`${detail.xmmc}库存为零，不能开此药品，请核查！`);
              }

              // 更新药品信息
              detail.scph = otherStock[0].scph;
              detail.scpc = otherStock[0].scpc;
              detail.xmdj = Math.round((otherStock[0].lsjg / medicine[0].ysxs) * 10000) / 10000;
              detail.pfjg = Math.round((otherStock[0].pfjg / medicine[0].ysxs) * 10000) / 10000;
            }

            // 更新库存
            const dfsl = detail.jfyl;
            await transactionalEntityManager.query(
              `UPDATE h31_kcxx
             SET ssdfsl = isnull(ssdfsl,0) + @0
             WHERE ypid = @1 AND scph = @2 AND ksid = @3`,
              [dfsl, detail.xmid, detail.scph, detail.zxksid],
            );
          }

          // 标记为已提交
          detail.tjbz = 1;
        }
        await this.saveSsxb(ssxb, transactionalEntityManager);

        // 如果是发药模式5，执行发药记录，
        if (kssz === '5') {
          await transactionalEntityManager.query(
            `EXEC sp_h13zxcs_fyjl @as_ksid = '', @li_para = @0, @ls_usid = @1, @yzlx = 3`,
            [ssxb.zyid, ssxb.userId],
          );
        }
      } catch (error) {
        console.error('提交手术明细失败:', error);
        throw new CustomException(ErrorCode.ERR_40901);
      }
    });
  }

  /**
   * 取消提交手术收费明细
   */
  async cancelSubmit(ssxb: H15SsxbBatchDto): Promise<void> {
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      try {
        // 获取细表记录
        const details = ssxb.items;

        for (const detail of details) {
          // 检查是否已发药
          if (detail.tpbz === 1) {
            throw new Error('该病人已发药不能删除，只能录入负数冲红！');
          }

          // 检查是否已提交
          if (detail.tjbz === 0) {
            continue;
          }

          // 如果是治疗类项目，直接取消提交
          if (detail.xmzl !== 2) {
            detail.tjbz = 0;
            continue;
          }

          // 查询药品信息
          const medicine = await transactionalEntityManager.query(
            `SELECT ysxs FROM h30_ypzd WHERE ypid = ?`,
            [detail.xmid],
          );

          if (!medicine || medicine.length === 0) {
            continue;
          }

          // 如果需要管理库存
          if (medicine[0].ysxs > 0) {
            // 更新库存
            const dfsl = detail.jfyl;
            await transactionalEntityManager.query(
              `UPDATE h31_kcxx
             SET ssdfsl = isnull(ssdfsl,0) - ?
             WHERE ypid = ? AND scph = ? AND ksid = ?`,
              [dfsl, detail.xmid, detail.scph, detail.zxksid],
            );
          }

          // 标记为未提交
          detail.tjbz = 0;
        }

        // 保存更改
        await this.saveSsxb(ssxb, transactionalEntityManager);
      } catch (error) {
        console.error('取消提交失败:', error);
        throw new CustomException(ErrorCode.ERR_40902);
      }
    });
  }

  /**
   * 更新收费明细
   */
  async update(updateDto: UpdateH15SsxbDto, manager: EntityManager): Promise<void> {
    const { maxid, syplmc, h15SsxbTfs, ...updateData } = updateDto as any;
    await manager.update(H15Ssxb, { maxid }, updateData);
  }

  /**
   * 分页查询收费明细
   */
  async findAll(queryDto: QueryH15SsxbDto) {
    const {
      pageNo = 1,
      pageSize = 10,
      sortBy = 'maxid',
      sortOrder = 'ASC',
      keyword,
      startSsrq,
      endSsrq,
      xmmcLike,
      zflx,
      sqdh,
      ...conditions
    } = queryDto;

    const queryBuilder = this.h15SsxbRepository
      .createQueryBuilder('entity')
      .leftJoin('entity.h15SszbEntity', 'h15Sszb')
      .leftJoin('entity.h15SsxbTfs', 'tf')
      .addSelect(['tf.jfyl', 'tf.tpbz']);

    // 基础条件查询
    Object.entries(conditions).forEach(([key, value]) => {
      if (value !== undefined && key !== 'sqdh') {
        queryBuilder.andWhere(`entity.${key} = :${key}`, { [key]: value });
      }
    });

    // 关键字搜索
    if (keyword) {
      queryBuilder.andWhere('(entity.xmmc LIKE :keyword OR entity.xmid LIKE :keyword)', {
        keyword: `%${keyword}%`,
      });
    }

    // 项目名称模糊查询
    if (xmmcLike) {
      queryBuilder.andWhere('entity.xmmc LIKE :xmmcLike', {
        xmmcLike: `%${xmmcLike}%`,
      });
    }

    // 收费日期范围查询
    if (startSsrq && endSsrq) {
      queryBuilder.andWhere('entity.ssrq BETWEEN :startSsrq AND :endSsrq', {
        startSsrq,
        endSsrq,
      });
    }

    // 费用类型查询
    if (zflx) {
      queryBuilder.andWhere('entity.zflx = :zflx', { zflx });
    }

    if (sqdh) {
      queryBuilder.andWhere('h15Sszb.sqdh = :sqdh', { sqdh });
    }

    // 排序
    queryBuilder.orderBy(`entity.${sortBy}`, sortOrder);

    // 分页
    const offset = (pageNo - 1) * pageSize;
    queryBuilder.skip(offset).take(pageSize);

    return await queryBuilder.getMany();
  }

  /**
   * 删除收费明细
   */
  async remove(maxid: number): Promise<DeleteResult> {
    return await this.h15SsxbRepository.delete({ maxid });
  }

  /**
   * 获取患者收费汇总
   */
  async getPatientFeeSummary(zyid: string) {
    const result = await this.h15SsxbRepository
      .createQueryBuilder('entity')
      .select([
        'entity.zyid',
        'SUM(entity.jfyl) as totalAmount',
        'SUM(CASE WHEN entity.jsbz = 1 THEN entity.jfyl ELSE 0 END) as settledAmount',
        'SUM(CASE WHEN entity.jsbz = 0 THEN entity.jfyl ELSE 0 END) as unsettledAmount',
      ])
      .where('entity.zyid = :zyid', { zyid })
      .groupBy('entity.zyid')
      .getRawOne();

    return (
      result || {
        zyid,
        totalAmount: 0,
        settledAmount: 0,
        unsettledAmount: 0,
      }
    );
  }
}
