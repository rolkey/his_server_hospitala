import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { H11Fpxb } from './h11_fpxb.entity';
import { CreateH11FpxbDto, UpdateH11FpxbDto, H11FpxbQueryDto } from './h11_fpxb.dto';

@Injectable()
export class H11FpxbService {
  constructor(
    @InjectRepository(H11Fpxb)
    private readonly h11FpxbRepository: Repository<H11Fpxb>,
  ) {}

  async create(createH11FpxbDto: CreateH11FpxbDto): Promise<H11Fpxb> {
    const entity = this.h11FpxbRepository.create(createH11FpxbDto);
    return await this.h11FpxbRepository.save(entity);
  }

  async findAll(queryDto: H11FpxbQueryDto): Promise<{ items: H11Fpxb[]; total: number }> {
    const { page = 1, limit = 10, ...filters } = queryDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.h11FpxbRepository.createQueryBuilder('fpxb');

    // 添加过滤条件
    if (filters.fphm) {
      queryBuilder.andWhere('fpxb.fphm = :fphm', { fphm: filters.fphm });
    }
    if (filters.fpxmid) {
      queryBuilder.andWhere('fpxb.fpxmid = :fpxmid', { fpxmid: filters.fpxmid });
    }
    if (filters.fpxmmc) {
      queryBuilder.andWhere('fpxb.fpxmmc LIKE :fpxmmc', { fpxmmc: `%${filters.fpxmmc}%` });
    }

    const [items, total] = await queryBuilder.skip(skip).take(limit).getManyAndCount();

    return { items, total };
  }

  async findOne(fphm: string, fpxmid: string): Promise<H11Fpxb> {
    const found = await this.h11FpxbRepository.findOne({ where: { fphm, fpxmid } });

    if (!found) {
      throw new NotFoundException(`发票号码 ${fphm} 和发票项目ID ${fpxmid} 的记录不存在`);
    }

    return found;
  }

  async update(fphm: string, fpxmid: string, updateH11FpxbDto: UpdateH11FpxbDto): Promise<H11Fpxb> {
    const result = await this.h11FpxbRepository.update({ fphm, fpxmid }, updateH11FpxbDto);

    if (result.affected === 0) {
      throw new NotFoundException(`发票号码 ${fphm} 和发票项目ID ${fpxmid} 的记录不存在`);
    }

    return this.findOne(fphm, fpxmid);
  }

  async remove(fphm: string, fpxmid: string): Promise<void> {
    const result = await this.h11FpxbRepository.delete({ fphm, fpxmid });

    if (result.affected === 0) {
      throw new NotFoundException(`发票号码 ${fphm} 和发票项目ID ${fpxmid} 的记录不存在`);
    }
  }
}
