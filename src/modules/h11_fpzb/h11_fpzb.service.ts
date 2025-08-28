import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { H11Fpzb } from './h11_fpzb.entity';
import { CreateH11FpzbDto, UpdateH11FpzbDto, H11FpzbQueryDto } from './h11_fpzb.dto';

@Injectable()
export class H11FpzbService {
  constructor(
    @InjectRepository(H11Fpzb)
    private readonly h11FpzbRepository: Repository<H11Fpzb>,
  ) {}

  async create(createH11FpzbDto: CreateH11FpzbDto): Promise<H11Fpzb> {
    const entity = this.h11FpzbRepository.create(createH11FpzbDto);
    return await this.h11FpzbRepository.save(entity);
  }

  async findAll(queryDto: H11FpzbQueryDto): Promise<{ items: H11Fpzb[]; total: number }> {
    const { page = 1, limit = 10, ...filters } = queryDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.h11FpzbRepository.createQueryBuilder('fpzb');

    // 添加过滤条件
    if (filters.fphm) {
      queryBuilder.andWhere('fpzb.fphm = :fphm', { fphm: filters.fphm });
    }
    if (filters.kshm) {
      queryBuilder.andWhere('fpzb.kshm = :kshm', { kshm: filters.kshm });
    }
    if (filters.zybh) {
      queryBuilder.andWhere('fpzb.zybh = :zybh', { zybh: filters.zybh });
    }
    if (filters.jsdh) {
      queryBuilder.andWhere('fpzb.jsdh = :jsdh', { jsdh: filters.jsdh });
    }
    if (filters.zyid) {
      queryBuilder.andWhere('fpzb.zyid = :zyid', { zyid: filters.zyid });
    }
    if (filters.brxm) {
      queryBuilder.andWhere('fpzb.brxm LIKE :brxm', { brxm: `%${filters.brxm}%` });
    }
    if (filters.ksid) {
      queryBuilder.andWhere('fpzb.ksid = :ksid', { ksid: filters.ksid });
    }
    if (filters.ksmc) {
      queryBuilder.andWhere('fpzb.ksmc LIKE :ksmc', { ksmc: `%${filters.ksmc}%` });
    }

    const [items, total] = await queryBuilder.skip(skip).take(limit).getManyAndCount();

    return { items, total };
  }

  async findOne(fphm: string): Promise<H11Fpzb> {
    const found = await this.h11FpzbRepository.findOne({
      where: { fphm },
    });

    return found;
  }
}
