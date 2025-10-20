import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { H11Xnh } from './h11_xnh.entity';
import { CreateH11XnhDto, UpdateH11XnhDto, H11XnhQueryDto } from './h11_xnh.dto';

@Injectable()
export class H11XnhService {
  constructor(
    @InjectRepository(H11Xnh)
    private readonly h11XnhRepository: Repository<H11Xnh>,
  ) {}

  async create(createH11XnhDto: CreateH11XnhDto): Promise<H11Xnh> {
    const entity = this.h11XnhRepository.create(createH11XnhDto);
    return await this.h11XnhRepository.save(entity);
  }

  async findAll(queryDto: H11XnhQueryDto): Promise<{ pageData: H11Xnh[]; total: number }> {
    const { pageNo = 1, pageSize = 10, ...filters } = queryDto;
    const skip = (pageNo - 1) * pageSize;

    const queryBuilder = this.h11XnhRepository.createQueryBuilder('xnh');

    // 添加过滤条件
    if (filters.fphm) {
      queryBuilder.andWhere('xnh.fphm = :fphm', { fphm: filters.fphm });
    }
    if (filters.zyid) {
      queryBuilder.andWhere('xnh.zyid = :zyid', { zyid: filters.zyid });
    }
    if (filters.zyh) {
      queryBuilder.andWhere('xnh.zyh = :zyh', { zyh: filters.zyh });
    }
    if (filters.brxm) {
      queryBuilder.andWhere('xnh.brxm LIKE :brxm', { brxm: `%${filters.brxm}%` });
    }
    if (filters.ylzh) {
      queryBuilder.andWhere('xnh.ylzh = :ylzh', { ylzh: filters.ylzh });
    }

    const [pageData, total] = await queryBuilder.skip(skip).take(pageSize).getManyAndCount();

    return { pageData, total };
  }

  async findOne(fphm: string): Promise<H11Xnh> {
    const found = await this.h11XnhRepository.findOne({ where: { fphm } });

    if (!found) {
      throw new NotFoundException(`发票号码 ${fphm} 不存在`);
    }

    return found;
  }

  async update(fphm: string, updateH11XnhDto: UpdateH11XnhDto): Promise<H11Xnh> {
    const result = await this.h11XnhRepository.update(fphm, updateH11XnhDto);

    if (result.affected === 0) {
      throw new NotFoundException(`发票号码 ${fphm} 不存在`);
    }

    return this.findOne(fphm);
  }

  async remove(fphm: string): Promise<void> {
    const result = await this.h11XnhRepository.delete(fphm);

    if (result.affected === 0) {
      throw new NotFoundException(`发票号码 ${fphm} 不存在`);
    }
  }
}
