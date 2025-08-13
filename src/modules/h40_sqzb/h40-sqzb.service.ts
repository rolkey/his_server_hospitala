import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { H40Sqzb } from './h40_sqzb.entity';
import { CreateH40SqzbDto, UpdateH40SqzbDto, QueryH40SqzbDto } from './h40_sqzb.dto';
import { H12Ryjl } from '../h12_ryjl/h12_ryjl.entity';

@Injectable()
export class H40SqzbService {
  constructor(
    @InjectRepository(H40Sqzb)
    private readonly h40SqzbRepository: Repository<H40Sqzb>,
    @InjectRepository(H12Ryjl)
    private readonly h12RyjlRepository: Repository<H12Ryjl>,
  ) {}

  async create(createDto: CreateH40SqzbDto): Promise<H40Sqzb> {
    const entity = this.h40SqzbRepository.create(createDto);
    return await this.h40SqzbRepository.save(entity);
  }

  async findAll(queryDto: QueryH40SqzbDto): Promise<[H40Sqzb[], number]> {
    const {
      pageNo = 1,
      pageSize = 10,
      startDate,
      endDate,
      sortBy = 'sqsj',
      sortOrder = 'DESC',
      ...rest
    } = queryDto;

    const where: any = { ...rest };

    // 处理模糊查询字段
    if (where.jcbw) where.jcbw = Like(`%${where.jcbw}%`);
    if (where.jcmd) where.jcmd = Like(`%${where.jcmd}%`);
    if (where.bzxx) where.bzxx = Like(`%${where.bzxx}%`);

    // 处理日期范围
    if (startDate && endDate) {
      where.sqsj = Between(new Date(startDate), new Date(endDate));
    } else if (startDate) {
      where.sqsj = Between(new Date(startDate), new Date());
    }

    const [result, total] = await this.h40SqzbRepository.findAndCount({
      where,
      order: { [sortBy]: sortOrder },
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
    });

    return [result, total];
  }

  async findOne(djbh: string): Promise<H40Sqzb> {
    return await this.h40SqzbRepository.findOne({ where: { djbh } });
  }

  async findAndCreate(yzzh: string, zyid: string, xmid: string): Promise<H40Sqzb> {
    // 使用原生的TypeORM查询方式，不通过实体类
    const result = await this.h40SqzbRepository
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from('lis_feeitem_vs_class', 'f') // 直接指定表名
      .where('f.sfxmdh = :xmid', { xmid })
      .getRawOne(); // getRawOne()获取原始结果
    // 取值
    if (result.count === 0) return null;

    const h40Sqzb = await this.h40SqzbRepository.findOne({ where: { djbh: yzzh } });
    if (h40Sqzb) return h40Sqzb;
    else {
      const h12Ryjl = await this.h12RyjlRepository.findOne({ where: { zyid, lx: '1' } });
      const { zs, bz1 } = h12Ryjl;
      const entity = this.h40SqzbRepository.create({ djbh: yzzh, bz1, tz: zs });
      return await this.h40SqzbRepository.save(entity);
    }
  }

  async update(djbh: string, updateDto: UpdateH40SqzbDto): Promise<H40Sqzb> {
    await this.h40SqzbRepository.update(djbh, updateDto);
    return await this.findOne(djbh);
  }

  async remove(djbh: string): Promise<void> {
    await this.h40SqzbRepository.delete(djbh);
  }

  async batchRemove(djbhList: string[]): Promise<void> {
    await this.h40SqzbRepository.delete(djbhList);
  }
}
