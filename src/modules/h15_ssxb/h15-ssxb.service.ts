import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, DeleteResult, EntityManager } from 'typeorm';
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
  ) {}

  /**
   * 创建收费明细
   */
  async create(createDto: UpdateH15SsxbDto, manager: EntityManager): Promise<H15Ssxb> {
    createDto.ypdh = (await this.gyIdentityService.getMax('h15_ssxb_ypdh')).toString();
    return await manager.save(H15Ssxb, createDto);
  }

  /**
   * 批量创建收费明细
   */
  async batchSave(ssxb: H15SsxbBatchDto): Promise<void> {
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      try {
        // 检查主表是否存在，不存在则创建主表记录
        const smSssq = await this.smSssqRepository.findOne({
          where: { sqdh: parseInt(ssxb.sqdh) },
        });
        const { zyid, ssrq, ssnm, mzys, ssys } = smSssq;
        const h11Brxx = await this.h11BrxxRepository.findOne({
          where: { zyid },
        });

        const h15Sszb = await transactionalEntityManager.findOne(H15Sszb, {
          where: { sqdh: parseInt(ssxb.sqdh) },
        });
        let ssid = '0';
        if (!h15Sszb) {
          ssid = (await this.gyIdentityService.getMax('h15_sszb')).toString();
          const newH15Sszb = this.h15SszbRepository.create({
            ssid,
            zyid,
            xh: 1,
            zybh: h11Brxx.zybh,
            sqdh: parseInt(ssxb.sqdh),
            ssrq,
            ssmc: ssnm,
            ssysid: ssys,
            ysid: mzys,
          });
          await transactionalEntityManager.save(H15Sszb, newH15Sszb);
        } else ssid = h15Sszb.ssid;
        for (const [index, item] of ssxb.items.entries()) {
          item.ssmxid = index + 1;
          item.xh = index + 1;
          item.ssid = ssid;
          if (!item.ypdh) await this.create(item, transactionalEntityManager);
          else await this.update(item, transactionalEntityManager);
        }
      } catch (error) {
        console.error('错误', error);
        throw error;
      }
    });
  }

  /**
   * 更新收费明细
   */
  async update(updateDto: UpdateH15SsxbDto, manager: EntityManager): Promise<void> {
    const { maxid, ...updateData } = updateDto;
    await manager.update(H15Ssxb, { maxid }, updateDto);
  }

  /**
   * 分页查询收费明细
   */
  async findAll(queryDto: QueryH15SsxbDto) {
    const {
      pageNo = 1,
      pageSize = 10,
      sortBy = 'xh',
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
      .leftJoinAndSelect('entity.h15SszbEntity', 'h15Sszb');

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
    // const [items, total] = await queryBuilder.getManyAndCount();

    // return {
    //   items,
    //   total,
    //   pageNo,
    //   pageSize,
    //   totalPages: Math.ceil(total / pageSize),
    // };
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
