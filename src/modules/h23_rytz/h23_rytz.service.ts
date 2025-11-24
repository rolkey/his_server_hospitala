import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { H23Rytz } from './h23_rytz.entity';
import { CreateH23RytzDto, UpdateH23RytzDto, H23RytzQueryDto } from './h23_rytz.dto';

@Injectable()
export class H23RytzService {
  constructor(
    @InjectRepository(H23Rytz)
    private readonly h23RytzRepository: Repository<H23Rytz>,
  ) {}

  async create(createH23RytzDto: CreateH23RytzDto): Promise<H23Rytz> {
    const entity = this.h23RytzRepository.create(createH23RytzDto);
    return await this.h23RytzRepository.save(entity);
  }

  async findAll(queryDto: H23RytzQueryDto): Promise<{ pageData: H23Rytz[]; total: number }> {
    const { page = 1, pageSize = 10, ...filters } = queryDto;
    const skip = (page - 1) * pageSize;

    const queryBuilder = this.h23RytzRepository
      .createQueryBuilder('rytz')
      .leftJoinAndSelect('rytz.ryqkEntity', 'ryqkEntity');

    // 添加过滤条件
    if (filters.tzdh) {
      queryBuilder.andWhere('rytz.tzdh = :tzdh', { tzdh: filters.tzdh });
    }
    if (filters.brxm) {
      queryBuilder.andWhere('rytz.brxm LIKE :brxm', { brxm: `%${filters.brxm}%` });
    }
    if (filters.mzid) {
      queryBuilder.andWhere('rytz.mzid = :mzid', { mzid: filters.mzid });
    }
    if (filters.ryksid) {
      queryBuilder.andWhere('rytz.ryksid = :ryksid', { ryksid: filters.ryksid });
    }
    if (filters.ysid) {
      queryBuilder.andWhere('rytz.ysid = :ysid', { ysid: filters.ysid });
    }
    if (filters.start) {
      queryBuilder.andWhere('rytz.rysj >= :start', { start: filters.start });
    }
    if (filters.end) {
      queryBuilder.andWhere('rytz.rysj <= :end', { end: filters.end });
    }
    if (filters.rybz) {
      queryBuilder.andWhere('rytz.rybz = :rybz', { rybz: filters.rybz });
    }

    const [pageData, total] = await queryBuilder.skip(skip).take(pageSize).getManyAndCount();

    return { pageData, total };
  }

  async findOne(tzdh: string): Promise<H23Rytz> {
    const found = await this.h23RytzRepository.findOne({ where: { tzdh } });

    if (!found) {
      throw new NotFoundException(`通知单号 ${tzdh} 不存在`);
    }

    return found;
  }

  async update(tzdh: string, updateH23RytzDto: UpdateH23RytzDto): Promise<H23Rytz> {
    const result = await this.h23RytzRepository.update(tzdh, updateH23RytzDto);

    if (result.affected === 0) {
      throw new NotFoundException(`通知单号 ${tzdh} 不存在`);
    }

    return this.findOne(tzdh);
  }

  async remove(tzdh: string): Promise<void> {
    const result = await this.h23RytzRepository.delete(tzdh);

    if (result.affected === 0) {
      throw new NotFoundException(`通知单号 ${tzdh} 不存在`);
    }
  }
}
