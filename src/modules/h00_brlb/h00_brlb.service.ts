import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { H00Brlb } from './h00_brlb.entity';
import { CreateH00BrlbDto, UpdateH00BrlbDto, H00BrlbQueryDto } from './h00_brlb.dto';

@Injectable()
export class H00BrlbService {
  constructor(
    @InjectRepository(H00Brlb)
    private readonly h00BrlbRepository: Repository<H00Brlb>,
  ) {}

  async create(createDto: CreateH00BrlbDto): Promise<H00Brlb> {
    const entity = this.h00BrlbRepository.create(createDto);
    return await this.h00BrlbRepository.save(entity);
  }

  async findAll(
    queryDto: H00BrlbQueryDto,
  ): Promise<{ pageData: H00Brlb[]; total: number } | H00Brlb[]> {
    const { pageNo = 1, pageSize = 10, brlbid, brlbmc } = queryDto;

    const qb = this.h00BrlbRepository.createQueryBuilder('brlb');

    if (brlbid) {
      qb.andWhere('brlb.brlbid LIKE :brlbid', { brlbid: `%${brlbid}%` });
    }
    if (brlbmc) {
      qb.andWhere('brlb.brlbmc LIKE :brlbmc', { brlbmc: `%${brlbmc}%` });
    }

    if (pageNo && pageSize) {
      const skip = (pageNo - 1) * pageSize;
      const [pageData, total] = await qb.skip(skip).take(pageSize).getManyAndCount();
      return { pageData, total };
    }
    return qb.getMany();
  }

  async findOne(brlbid: string): Promise<H00Brlb> {
    const found = await this.h00BrlbRepository.findOne({ where: { brlbid } });
    if (!found) {
      throw new NotFoundException(`病人类别 ${brlbid} 不存在`);
    }
    return found;
  }

  async update(brlbid: string, updateDto: UpdateH00BrlbDto): Promise<H00Brlb> {
    const result = await this.h00BrlbRepository.update(brlbid, updateDto as Partial<H00Brlb>);
    if (result.affected === 0) {
      throw new NotFoundException(`病人类别 ${brlbid} 不存在`);
    }
    return this.findOne(brlbid);
  }

  async remove(brlbid: string): Promise<void> {
    const result = await this.h00BrlbRepository.delete(brlbid);
    if (result.affected === 0) {
      throw new NotFoundException(`病人类别 ${brlbid} 不存在`);
    }
  }
}
