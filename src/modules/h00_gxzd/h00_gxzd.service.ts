import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { H00Gxzd } from './h00_gxzd.entity';
import { CreateH00GxzdDto, UpdateH00GxzdDto, H00GxzdQueryDto } from './h00_gxzd.dto';

@Injectable()
export class H00GxzdService {
  constructor(
    @InjectRepository(H00Gxzd)
    private readonly h00GxzdRepository: Repository<H00Gxzd>,
  ) {}

  async create(createDto: CreateH00GxzdDto): Promise<H00Gxzd> {
    const entity = this.h00GxzdRepository.create(createDto);
    return await this.h00GxzdRepository.save(entity);
  }

  async findAll(
    queryDto: H00GxzdQueryDto,
  ): Promise<{ pageData: H00Gxzd[]; total: number } | H00Gxzd[]> {
    const { pageNo = 1, pageSize = 10, gxid, gxmc } = queryDto;

    const qb = this.h00GxzdRepository.createQueryBuilder('gxzd');

    if (gxid) {
      qb.andWhere('gxzd.gxid LIKE :gxid', { gxid: `%${gxid}%` });
    }
    if (gxmc) {
      qb.andWhere('gxzd.gxmc LIKE :gxmc', { gxmc: `%${gxmc}%` });
    }

    if (pageNo && pageSize) {
      const skip = (pageNo - 1) * pageSize;
      const [pageData, total] = await qb.skip(skip).take(pageSize).getManyAndCount();
      return { pageData, total };
    }
    return qb.getMany();
  }

  async findOne(gxid: string): Promise<H00Gxzd> {
    const found = await this.h00GxzdRepository.findOne({ where: { gxid } });
    if (!found) {
      throw new NotFoundException(`关系字典 ${gxid} 不存在`);
    }
    return found;
  }

  async update(gxid: string, updateDto: UpdateH00GxzdDto): Promise<H00Gxzd> {
    const result = await this.h00GxzdRepository.update(gxid, updateDto as Partial<H00Gxzd>);
    if (result.affected === 0) {
      throw new NotFoundException(`关系字典 ${gxid} 不存在`);
    }
    return this.findOne(gxid);
  }

  async remove(gxid: string): Promise<void> {
    const result = await this.h00GxzdRepository.delete(gxid);
    if (result.affected === 0) {
      throw new NotFoundException(`关系字典 ${gxid} 不存在`);
    }
  }
}
