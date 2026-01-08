import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, DeleteResult } from 'typeorm';
import { H15Ssxb } from './h15-ssxb.entity';
import {
  CreateH15SsxbDto,
  QueryH15SsxbDto,
  UpdateH15SsxbDto,
  H15SsxbBatchOperationDto,
  FeeStatisticsDto,
  UpdateFeeStatusDto,
} from './dto/h15-ssxb.dto';

@Injectable()
export class H15SsxbService {
  constructor(
    @InjectRepository(H15Ssxb)
    private readonly h15SsxbRepository: Repository<H15Ssxb>,
  ) {}

  /**
   * 创建收费明细
   */
  async create(createDto: CreateH15SsxbDto): Promise<H15Ssxb> {
    const entity = this.h15SsxbRepository.create(createDto);
    return await this.h15SsxbRepository.save(entity);
  }

  /**
   * 批量创建收费明细
   */
  async batchCreate(createDtos: CreateH15SsxbDto[]): Promise<H15Ssxb[]> {
    const entities = createDtos.map((dto) => this.h15SsxbRepository.create(dto));
    return await this.h15SsxbRepository.save(entities);
  }

  /**
   * 更新收费明细
   */
  async update(
    ssid: string,
    zyid: string,
    ssmxid: number,
    czid: string,
    xh: number,
    ksid: string,
    updateDto: UpdateH15SsxbDto,
  ): Promise<H15Ssxb> {
    await this.h15SsxbRepository.update({ ssid, zyid, ssmxid, czid, xh, ksid }, updateDto);
    return await this.findOne(ssid, zyid, ssmxid, czid, xh, ksid);
  }

  /**
   * 查询单个收费明细
   */
  async findOne(
    ssid: string,
    zyid: string,
    ssmxid: number,
    czid: string,
    xh: number,
    ksid: string,
  ): Promise<H15Ssxb> {
    return await this.h15SsxbRepository.findOne({
      where: { ssid, zyid, ssmxid, czid, xh, ksid },
    });
  }

  /**
   * 分页查询收费明细
   */
  async findAll(queryDto: QueryH15SsxbDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'xh',
      sortOrder = 'ASC',
      keyword,
      startSsrq,
      endSsrq,
      xmmcLike,
      zflx,
      ...conditions
    } = queryDto;

    const queryBuilder = this.h15SsxbRepository.createQueryBuilder('entity');

    // 基础条件查询
    Object.entries(conditions).forEach(([key, value]) => {
      if (value !== undefined) {
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

    // 排序
    queryBuilder.orderBy(`entity.${sortBy}`, sortOrder);

    // 分页
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 删除收费明细
   */
  async remove(
    ssid: string,
    zyid: string,
    ssmxid: number,
    czid: string,
    xh: number,
    ksid: string,
  ): Promise<DeleteResult> {
    return await this.h15SsxbRepository.delete({
      ssid,
      zyid,
      ssmxid,
      czid,
      xh,
      ksid,
    });
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
