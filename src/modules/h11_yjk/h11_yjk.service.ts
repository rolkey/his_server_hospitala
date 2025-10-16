import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { H11Yjk } from './h11_yjk.entity';
import { CreateH11YjkDto, UpdateH11YjkDto, H11YjkQueryDto, H11YjkCancelDto } from './h11_yjk.dto';
import { UpdateH11ZypjDto, H11ZypjPrimaryDto } from '../h11_zypj/h11_zypj.dto';
import { H11ZypjService } from '../h11_zypj/h11_zypj.service';

@Injectable()
export class H11YjkService {
  constructor(
    @InjectRepository(H11Yjk)
    private readonly h11YjkRepository: Repository<H11Yjk>,
    private readonly h11ZypjService: H11ZypjService,
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
      },
    });

    if (exists) {
      throw new BadRequestException(
        `此号码已被使用，请联系系统管理员,收据号码 ${createH11YjkDto.sjhm} 在收费时间 ${createH11YjkDto.sfsj} 的记录已存在!`,
      );
    }

    const h11ZypjPrimaryDto: H11ZypjPrimaryDto = {
      pjlxid: 'YJHM',
      usid: createH11YjkDto.sfyid,
      fyid: '1',
    };

    const zypj = await this.h11ZypjService.findOne(h11ZypjPrimaryDto);
    if (!zypj.dqhm) {
      throw new BadRequestException(
        `票据类型 ${h11ZypjPrimaryDto.pjlxid}, 使用者ID ${h11ZypjPrimaryDto.usid}, 费用ID ${h11ZypjPrimaryDto.fyid} 的票据记录不存在，请联系系统管理员!`,
      );
    }

    const updateH11ZypjDto: UpdateH11ZypjDto = { dqhm: Number(zypj.dqhm) + 1 };
    await this.h11ZypjService.update('YJHM', createH11YjkDto.sfyid, '1', updateH11ZypjDto);

    const newYjk = this.h11YjkRepository.create(createH11YjkDto);
    return this.h11YjkRepository.save(newYjk);
  }

  /**
   * 查询所有预交款记录（带分页和筛选）
   * @param queryDto 查询参数
   * @returns 预交款记录列表和总数
   */
  async findAll(queryDto: H11YjkQueryDto): Promise<{ pageData: H11Yjk[]; total: number }> {
    const {
      sjhm,
      brxm,
      zyid,
      ksid,
      sjzt,
      startDate,
      endDate,
      pageNo = 1,
      pageSize = 10,
    } = queryDto;

    const queryBuilder = this.h11YjkRepository.createQueryBuilder('yjk');

    // 添加筛选条件
    if (sjhm) {
      queryBuilder.orWhere('yjk.sjhm LIKE :sjhm', { sjhm: `%${sjhm}%` });
    }

    if (brxm) {
      queryBuilder.orWhere('yjk.brxm LIKE :brxm', { brxm: `%${brxm}%` });
    }

    if (zyid) {
      queryBuilder.orWhere('yjk.zyid = :zyid', { zyid });
    }

    if (ksid) {
      queryBuilder.orWhere('yjk.ksid = :ksid', { ksid });
    }

    if (sjzt !== undefined) {
      queryBuilder.orWhere('yjk.sjzt = :sjzt', { sjzt });
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
    const pageData = await queryBuilder
      .orderBy('yjk.sfsj', 'DESC')
      .skip((pageNo - 1) * pageSize)
      .take(pageSize)
      .getMany();

    return { pageData, total };
  }

  /**
   * 根据主键查找预交款记录
   * @param sjhm 收据号码
   * @param sfsj 收费时间
   * @returns 预交款记录
   */
  async findOne(sjhm: string, sfsj: Date): Promise<H11Yjk> {
    const yjk = await this.h11YjkRepository.findOne({
      where: { sjhm },
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

  /**
   * 预交金作废
   * @param sjhm 收据号码
   * @param sfsj 收费时间
   * @param h11YjkCancelDto 更新数据
   * @returns 更新后的预交款记录
   */
  async cancelOrRefund(h11YjkCancelDto: H11YjkCancelDto): Promise<void> {
    const yjk = await this.findOne(h11YjkCancelDto.sjhm, null);

    if (!yjk) {
      throw new NotFoundException(`收据号码为 ${h11YjkCancelDto.sjhm} 的预交款记录不存在!`);
    }
    if (yjk?.sjzt === 0 || yjk?.sjzt === 4) {
      throw new BadRequestException('该预交款记录已经作废！');
    }
    if (yjk?.sjzt === 2) {
      throw new BadRequestException('该预交款记录已经退款！');
    }
    if (yjk?.zfyid) {
      throw new BadRequestException('该预交款记录已经红冲！');
    }

    // 增加一条负数记录
    const zfYjk = this.h11YjkRepository.create(yjk);
    zfYjk.sfsj = new Date();
    zfYjk.sjhm = 'Z' + yjk.sjhm;
    zfYjk.yjje = -1 * yjk.yjje;
    zfYjk.sfyxm = h11YjkCancelDto.zfyxm;
    zfYjk.sfyid = h11YjkCancelDto.zfyid;
    zfYjk.rmbje = -1 * yjk.rmbje;
    zfYjk.fkfsid = '1';
    if (h11YjkCancelDto.type === '2') {
      zfYjk.sjzt = 2;
    } else {
      zfYjk.sjzt = 0;
    }
    await this.h11YjkRepository.save(zfYjk);

    await this.h11YjkRepository
      .createQueryBuilder()
      .update()
      .set({ zfyid: h11YjkCancelDto.zfyid })
      .where('sjhm = :sjhm', { sjhm: yjk.sjhm })
      .andWhere('sfsj = :sfsj', { sfsj: yjk.sfsj })
      .execute();
  }
}
