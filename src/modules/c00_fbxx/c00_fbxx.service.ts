import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, FindOptionsWhere } from 'typeorm';
import { C00Fbxx } from './c00_fbxx.entity';
import {
  CreateC00FbxxDto,
  UpdateC00FbxxDto,
  QueryC00FbxxDto,
  BaseC00FbxxDto,
} from './dto/c00_fbxx.dto';

@Injectable()
export class C00FbxxService {
  constructor(
    @InjectRepository(C00Fbxx)
    private readonly c00FbxxRepository: Repository<C00Fbxx>,
  ) {}

  // 创建记录
  async create(createDto: CreateC00FbxxDto): Promise<C00Fbxx> {
    const entity = this.c00FbxxRepository.create(createDto);
    return await this.c00FbxxRepository.save(entity);
  }

  // 查询所有记录（带分页和条件查询 - 优化版）
  async findAll(queryDto: QueryC00FbxxDto): Promise<{ data: C00Fbxx[]; total: number }> {
    const { page = 1, limit = 1000, ...filters } = queryDto;

    const skip = (page - 1) * limit;

    // 构建查询条件
    const whereCondition: FindOptionsWhere<C00Fbxx> = {};

    // 动态添加查询条件
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value !== undefined && value !== null && value !== '') {
        if (['fksid', 'sksid'].includes(key)) {
          // 字符串字段使用模糊查询
          whereCondition[key] = Like(`%${value}%`);
        } else {
          whereCondition[key] = value;
        }
      }
    });

    const [data, total] = await this.c00FbxxRepository.findAndCount({
      where: whereCondition,
      skip,
      take: limit,
    });

    return { data, total };
  }

  // 其他方法保持不变...
  async findOne(jlxh: number): Promise<C00Fbxx> {
    const entity = await this.c00FbxxRepository.findOne({ where: { jlxh } });
    if (!entity) {
      throw new NotFoundException(`记录 jlxh=${jlxh} 不存在`);
    }
    return entity;
  }

  // 更新记录
  async update(jlxh: number, updateDto: UpdateC00FbxxDto): Promise<C00Fbxx> {
    const entity = await this.findOne(jlxh);

    // 使用 BaseDTO 中的字段更新
    Object.assign(entity, updateDto);

    return await this.c00FbxxRepository.save(entity);
  }

  // 批量更新
  async batchUpdate(updateDtos: UpdateC00FbxxDto[]): Promise<C00Fbxx[]> {
    const entities: C00Fbxx[] = [];

    for (const updateDto of updateDtos) {
      const entity = await this.findOne(updateDto.jlxh);
      Object.assign(entity, updateDto);
      entities.push(entity);
    }

    return await this.c00FbxxRepository.save(entities);
  }

  // 根据多个条件查询
  async findByConditions(conditions: Partial<BaseC00FbxxDto>): Promise<C00Fbxx[]> {
    return await this.c00FbxxRepository.find({
      where: conditions as FindOptionsWhere<C00Fbxx>,
      order: { jlxh: 'DESC' },
    });
  }
}
