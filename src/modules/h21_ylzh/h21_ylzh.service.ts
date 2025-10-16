import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { H21Ylzh } from './h21_ylzh.entity';
import { CreateH21YlzhDto, UpdateH21YlzhDto, H21YlzhQueryDto } from './h21_ylzh.dto';

@Injectable()
export class H21YlzhService {
  constructor(
    @InjectRepository(H21Ylzh)
    private readonly h21YlzhRepository: Repository<H21Ylzh>,
  ) {}

  async create(createH21YlzhDto: CreateH21YlzhDto): Promise<H21Ylzh> {
    const entity = this.h21YlzhRepository.create(createH21YlzhDto);
    return await this.h21YlzhRepository.save(entity);
  }

  async findAll(queryDto: H21YlzhQueryDto): Promise<{ pageData: H21Ylzh[]; total: number }> {
    const { pageNo = 1, pageSize = 10, ...filters } = queryDto;
    const skip = (pageNo - 1) * pageSize;

    const queryBuilder = this.h21YlzhRepository.createQueryBuilder('ylzh');

    // 添加过滤条件
    if (filters.ylzh) {
      queryBuilder.orWhere('ylzh.ylzh LIKE :ylzh', { ylzh: `%${filters.ylzh}%` });
    }
    if (filters.brxm) {
      queryBuilder.orWhere('ylzh.brxm LIKE :brxm', { brxm: `%${filters.brxm}%` });
    }
    if (filters.sfzh) {
      queryBuilder.orWhere('ylzh.sfzh LIKE :sfzh', { sfzh: `%${filters.sfzh}%` });
    }
    if (filters.lxdh) {
      queryBuilder.orWhere('ylzh.dh LIKE :lxdh', { lxdh: `%${filters.lxdh}%` });
    }

    const [pageData, total] = await queryBuilder.skip(skip).take(pageSize).getManyAndCount();

    return { pageData, total };
  }

  async findOne(ylzh: string): Promise<H21Ylzh> {
    const found = await this.h21YlzhRepository.findOne({ where: { ylzh } });

    if (!found) {
      throw new NotFoundException(`医疗账号 ${ylzh} 不存在`);
    }

    return found;
  }

  async update(ylzh: string, updateH21YlzhDto: UpdateH21YlzhDto): Promise<H21Ylzh> {
    const result = await this.h21YlzhRepository.update(ylzh, updateH21YlzhDto);

    if (result.affected === 0) {
      throw new NotFoundException(`医疗账号 ${ylzh} 不存在`);
    }

    return this.findOne(ylzh);
  }

  async remove(ylzh: string): Promise<void> {
    const result = await this.h21YlzhRepository.delete(ylzh);

    if (result.affected === 0) {
      throw new NotFoundException(`医疗账号 ${ylzh} 不存在`);
    }
  }
}
