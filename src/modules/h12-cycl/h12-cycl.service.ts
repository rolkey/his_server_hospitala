// src/h12-cycl/h12-cycl.service.ts
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, EntityManager } from 'typeorm';
import { H12Cycl } from './h12-cycl.entity';
import { CreateH12CyclDto, UpdateH12CyclDto, QueryH12CyclDto } from './dto/h12-cycl.dto';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';

@Injectable()
export class H12CyclService {
  constructor(
    @InjectRepository(H12Cycl)
    private readonly h12CyclRepository: Repository<H12Cycl>,
    // @InjectRepository(h11_brxx)
    // private readonly h11_brxxRepository: Repository<h11_brxx>,
  ) {}

  // 创建记录
  async create(createH12CyclDto: CreateH12CyclDto): Promise<H12Cycl> {
    const entity = this.h12CyclRepository.create(createH12CyclDto);
    return await this.h12CyclRepository.save(entity);
  }

  // 分页查询
  async findAll(queryDto: QueryH12CyclDto): Promise<{
    data: H12Cycl[];
    total: number;
    pageNo: number;
    pageSize: number;
  }> {
    const { pageNo = 1, pageSize = 10, ...whereConditions } = queryDto;
    const skip = (pageNo - 1) * pageSize;
    const take = pageSize;

    // 构建查询条件
    const where: any = {};

    // 处理字符串字段的模糊查询
    Object.keys(whereConditions).forEach((key) => {
      if (whereConditions[key] !== undefined && whereConditions[key] !== null) {
        if (typeof whereConditions[key] === 'string' && whereConditions[key].trim() !== '') {
          where[key] = Like(`%${whereConditions[key]}%`);
        } else if (whereConditions[key] !== '') {
          where[key] = whereConditions[key];
        }
      }
    });

    // 处理日期范围查询
    if (queryDto.rysjStart && queryDto.rysjEnd) {
      where.rysj = Between(queryDto.rysjStart, queryDto.rysjEnd);
    }
    if (queryDto.cysjStart && queryDto.cysjEnd) {
      where.cysj = Between(queryDto.cysjStart, queryDto.cysjEnd);
    }
    if (queryDto.lrsjStart && queryDto.lrsjEnd) {
      where.lrsj = Between(queryDto.lrsjStart, queryDto.lrsjEnd);
    }

    // 处理排序
    let order = {};
    if (queryDto.sortBy) {
      order[queryDto.sortBy] = queryDto.sortOrder || 'ASC';
    } else {
      order = { lrsj: 'DESC' }; // 默认按录入时间倒序
    }

    const [data, total] = await this.h12CyclRepository.findAndCount({
      where,
      order,
      skip,
      take,
    });

    return {
      data,
      total,
      pageNo,
      pageSize,
    };
  }

  // 根据ID查询单条记录
  async findOne(zyid: string): Promise<H12Cycl> {
    const entity = await this.h12CyclRepository.findOne({
      where: { zyid },
    });

    if (!entity) {
      throw new NotFoundException(`"${zyid}"出院记录没有找到`);
    }

    return entity;
  }

  // 更新记录
  async update(zyid: string, updateH12CyclDto: UpdateH12CyclDto): Promise<H12Cycl> {
    const entity = await this.findOne(zyid);

    const updatedEntity = this.h12CyclRepository.merge(entity, updateH12CyclDto);
    return await this.h12CyclRepository.save(updatedEntity);
  }

  // 删除记录
  async remove(zyid: string): Promise<void> {
    const entity = await this.findOne(zyid);
    await this.h12CyclRepository.remove(entity);
  }

  // 批量删除
  async removeBatch(zyids: string[]): Promise<void> {
    await this.h12CyclRepository
      .createQueryBuilder()
      .delete()
      .where('zyid IN (:...zyids)', { zyids })
      .execute();
  }

  // 根据住院编号查询
  async findByZybh(zybh: string): Promise<H12Cycl[]> {
    return await this.h12CyclRepository.find({
      where: { zybh: Like(`%${zybh}%`) },
      order: { lrsj: 'DESC' },
    });
  }

  // 根据病人姓名查询
  async findByBrxm(brxm: string): Promise<H12Cycl[]> {
    return await this.h12CyclRepository.find({
      where: { brxm: Like(`%${brxm}%`) },
      order: { lrsj: 'DESC' },
    });
  }

  async recreateCycl(dto: CreateH12CyclDto, manager: EntityManager): Promise<void> {
    // const {
    //   zyid,
    //   zybh,
    //   brxm,
    //   rycw,
    //   ryqk,
    //   ksid,
    //   sjzt,
    //   xbid,
    //   rysj,
    //   cyqk,
    //   cysj,
    //   bz2,
    //   lrsj,
    //   bz3,
    //   bzxx,
    //   bz1,
    // } = dto;
    // const entity = this.h12CyclRepository.create({
    //   zyid,
    //   zybh,
    //   brxm,
    //   rycw,
    //   ryqk,
    //   ksid,
    //   sjzt,
    //   xbid,
    //   rysj,
    //   cyqk,
    //   cysj,
    //   bz2,
    //   lrsj,
    //   bz3,
    //   bzxx,
    //   bz1,
    // });
    const cycl = await manager.findOne(H12Cycl, { where: { zyid: dto.zyid } });
    if (cycl) {
      await manager.remove(cycl);
    }
    const entity = this.h12CyclRepository.create(dto);
    await manager.update(h11_brxx, { zyid: dto.zyid }, { bz2: dto.bz2, cyzd: dto.bz3 });
    await manager.save(entity);
  }
}
