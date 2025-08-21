import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { H11Yjk } from './h11-yjk.entity';
import { CreateH11YjkDto, UpdateH11YjkDto, H11YjkQueryDto } from './h11-yjk.dto';

@Injectable()
export class H11YjkService {
  constructor(
    @InjectRepository(H11Yjk)
    private readonly h11YjkRepository: Repository<H11Yjk>,
  ) {}

  /**
   * 创建预交款记录
   * @param createH11YjkDto 创建预交款数据
   * @returns 创建的预交款记录
   */
  async create(createH11YjkDto: CreateH11YjkDto): Promise<H11Yjk> {
    // 检查是否已存在相同主键的记录
    const exists = await this.h11YjkRepository.findOne({
      where: {
        sjhm: createH11YjkDto.sjhm,
        sfsj: createH11YjkDto.sfsj,
      },
    });

    if (exists) {
      throw new BadRequestException(
        `收据号码 ${createH11YjkDto.sjhm} 在收费时间 ${createH11YjkDto.sfsj} 的记录已存在`,
      );
    }

    const newYjk = this.h11YjkRepository.create(createH11YjkDto);
    return this.h11YjkRepository.save(newYjk);
  }

  /**
   * 查询所有预交款记录（带分页和筛选）
   * @param queryDto 查询参数
   * @returns 预交款记录列表和总数
   */
  async findAll(queryDto: H11YjkQueryDto): Promise<{ items: H11Yjk[]; total: number }> {
    const { sjhm, brxm, zyid, ksid, sjzt, startDate, endDate, page = 1, limit = 10 } = queryDto;

    const queryBuilder = this.h11YjkRepository.createQueryBuilder('yjk');

    // 添加筛选条件
    if (sjhm) {
      queryBuilder.andWhere('yjk.sjhm LIKE :sjhm', { sjhm: `%${sjhm}%` });
    }

    if (brxm) {
      queryBuilder.andWhere('yjk.brxm LIKE :brxm', { brxm: `%${brxm}%` });
    }

    if (zyid) {
      queryBuilder.andWhere('yjk.zyid = :zyid', { zyid });
    }

    if (ksid) {
      queryBuilder.andWhere('yjk.ksid = :ksid', { ksid });
    }

    if (sjzt !== undefined) {
      queryBuilder.andWhere('yjk.sjzt = :sjzt', { sjzt });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('yjk.sfsj BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    } else if (startDate) {
      queryBuilder.andWhere('yjk.sfsj >= :startDate', { startDate });
    } else if (endDate) {
      queryBuilder.andWhere('yjk.sfsj <= :endDate', { endDate });
    }

    // 计算总数
    const total = await queryBuilder.getCount();

    // 添加分页
    const items = await queryBuilder
      .orderBy('yjk.sfsj', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { items, total };
  }

  /**
   * 根据主键查找预交款记录
   * @param sjhm 收据号码
   * @param sfsj 收费时间
   * @returns 预交款记录
   */
  async findOne(sjhm: string, sfsj: Date): Promise<H11Yjk> {
    const yjk = await this.h11YjkRepository.findOne({
      where: { sjhm, sfsj },
    });

    if (!yjk) {
      throw new NotFoundException(`收据号码 ${sjhm} 在收费时间 ${sfsj} 的预交款记录不存在`);
    }

    return yjk;
  }

  /**
   * 根据住院ID查询预交款记录
   * @param zyid 住院ID
   * @returns 预交款记录列表
   */
  async findByZyid(zyid: string): Promise<H11Yjk[]> {
    return this.h11YjkRepository.find({
      where: { zyid },
      order: { sfsj: 'DESC' },
    });
  }

  /**
   * 更新预交款记录
   * @param sjhm 收据号码
   * @param sfsj 收费时间
   * @param updateH11YjkDto 更新数据
   * @returns 更新后的预交款记录
   */
  async update(sjhm: string, sfsj: Date, updateH11YjkDto: UpdateH11YjkDto): Promise<H11Yjk> {
    const yjk = await this.findOne(sjhm, sfsj);

    // 更新实体
    Object.assign(yjk, updateH11YjkDto);

    return this.h11YjkRepository.save(yjk);
  }

  /**
   * 删除预交款记录
   * @param sjhm 收据号码
   * @param sfsj 收费时间
   * @returns 删除结果
   */
  async remove(sjhm: string, sfsj: Date): Promise<void> {
    const yjk = await this.findOne(sjhm, sfsj);
    await this.h11YjkRepository.remove(yjk);
  }

  /**
   * 统计指定时间段内的预交款总额
   * @param startDate 开始日期
   * @param endDate 结束日期
   * @returns 预交款总额
   */
  async getTotalAmount(startDate: Date, endDate: Date): Promise<number> {
    const result = await this.h11YjkRepository
      .createQueryBuilder('yjk')
      .select('SUM(yjk.rmbje)', 'total')
      .where('yjk.sfsj BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getRawOne();

    return result.total || 0;
  }

  /**
   * 按科室统计预交款金额
   * @param startDate 开始日期
   * @param endDate 结束日期
   * @returns 各科室预交款统计
   */
  async getAmountByDepartment(startDate: Date, endDate: Date): Promise<any[]> {
    return this.h11YjkRepository
      .createQueryBuilder('yjk')
      .select('yjk.ksid', 'ksid')
      .addSelect('yjk.ksmc', 'ksmc')
      .addSelect('SUM(yjk.rmbje)', 'total')
      .addSelect('COUNT(yjk.sjhm)', 'count')
      .where('yjk.sfsj BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('yjk.ksid')
      .addGroupBy('yjk.ksmc')
      .orderBy('total', 'DESC')
      .getRawMany();
  }
}
