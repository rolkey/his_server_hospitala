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
  ) { }

  async create(createH21YlzhDto: CreateH21YlzhDto): Promise<H21Ylzh> {
    const entity = this.h21YlzhRepository.create(createH21YlzhDto);
    return await this.h21YlzhRepository.save(entity);
  }

  async findAll(
    queryDto: H21YlzhQueryDto,
  ): Promise<{ pageData: H21Ylzh[]; total: number } | H21Ylzh[]> {
    const { ...filters } = queryDto;
    const pageSize = queryDto.pageSize || 100;
    const pageNo = queryDto.pageNo || 1;

    const queryBuilder = this.h21YlzhRepository
      .createQueryBuilder('ylzh')
      .leftJoinAndSelect('ylzh.brlbEntity', 'brlbEntity')
      .leftJoinAndSelect('ylzh.gxdzEntity', 'gxdzEntity');

    // 关键字类模糊过滤（任一匹配即可）
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
      queryBuilder.orWhere('ylzh.lxdh LIKE :lxdh', { lxdh: `%${filters.lxdh}%` });
    }

    // 额外过滤条件（在上面关键字匹配基础上进一步收窄）
    if (filters.kh) {
      // 卡号：就诊卡号/本院卡/电子码/医疗账号 均可匹配
      queryBuilder.andWhere(
        '(ylzh.ylzh = :kh OR ylzh.bkh = :kh OR ylzh.jkh = :kh OR ylzh.dzjkk = :kh)',
        { kh: filters.kh },
      );
    }

    if (filters.brnlStart != null) {
      // 年龄下限（brnl 为字符串，这里按数字比较）
      queryBuilder.andWhere('CAST(ylzh.brnl AS INT) >= :brnlStart', {
        brnlStart: filters.brnlStart,
      });
    }

    if (filters.brnlEnd != null) {
      // 年龄上限
      queryBuilder.andWhere('CAST(ylzh.brnl AS INT) <= :brnlEnd', {
        brnlEnd: filters.brnlEnd,
      });
    }

    if (filters.bzzl) {
      // 特殊人群：任意标志位满足即可
      queryBuilder.andWhere('(ylzh.bzz1 = :bzzl OR ylzh.bzz2 = :bzzl OR ylzh.bzz3 = :bzzl)', {
        bzzl: filters.bzzl,
      });
    }

    if (filters.dh) {
      queryBuilder.andWhere('ylzh.dh LIKE :dh', { dh: `%${filters.dh}%` });
    }

    if (filters.jtdz) {
      queryBuilder.andWhere('ylzh.jtdz LIKE :jtdz', { jtdz: `%${filters.jtdz}%` });
    }

    if (filters.mjly) {
      queryBuilder.andWhere('ylzh.mjly = :mjly', { mjly: filters.mjly });
    }

    if (filters.xbid) {
      queryBuilder.andWhere('ylzh.xbid = :xbid', { xbid: filters.xbid });
    }

    // if (pageNo && pageSize) {
    const skip = (pageNo - 1) * pageSize;
    const [pageData, total] = await queryBuilder.skip(skip).take(pageSize).getManyAndCount();
    return { pageData, total };
    // } else {
    //   const data = await queryBuilder.getMany();
    //   return data;
    // }
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
