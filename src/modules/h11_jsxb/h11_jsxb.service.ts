import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { H11Jsxb } from './h11_jsxb.entity';
import { CreateH11JsxbDto, UpdateH11JsxbDto, H11JsxbQueryDto } from './h11_jsxb.dto';

@Injectable()
export class H11JsxbService {
  constructor(
    @InjectRepository(H11Jsxb)
    private readonly h11JsxbRepository: Repository<H11Jsxb>,
  ) {}

  async create(createH11JsxbDto: CreateH11JsxbDto): Promise<H11Jsxb> {
    const entity = this.h11JsxbRepository.create(createH11JsxbDto);
    return await this.h11JsxbRepository.save(entity);
  }

  async findAll(queryDto: H11JsxbQueryDto): Promise<{ items: H11Jsxb[]; total: number }> {
    const { page = 1, limit = 10, ...filters } = queryDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.h11JsxbRepository.createQueryBuilder('jsxb');

    // 添加过滤条件
    if (filters.jsdh) {
      queryBuilder.andWhere('jsxb.jsdh = :jsdh', { jsdh: filters.jsdh });
    }
    if (filters.fylbid) {
      queryBuilder.andWhere('jsxb.fylbid = :fylbid', { fylbid: filters.fylbid });
    }
    if (filters.fylbmc) {
      queryBuilder.andWhere('jsxb.fylbmc LIKE :fylbmc', { fylbmc: `%${filters.fylbmc}%` });
    }

    const [items, total] = await queryBuilder.skip(skip).take(limit).getManyAndCount();

    return { items, total };
  }

  async findAllNotPage(queryDto: H11JsxbQueryDto): Promise<{ pageData: H11Jsxb[]; total: number }> {
    const { page = 1, limit = 10, ...filters } = queryDto;
    const queryBuilder = this.h11JsxbRepository.createQueryBuilder('jsxb');

    // 添加过滤条件
    if (filters.jsdh) {
      queryBuilder.andWhere('jsxb.jsdh = :jsdh', { jsdh: filters.jsdh });
    }
    if (filters.fylbid) {
      queryBuilder.andWhere('jsxb.fylbid = :fylbid', { fylbid: filters.fylbid });
    }
    if (filters.fylbmc) {
      queryBuilder.andWhere('jsxb.fylbmc LIKE :fylbmc', { fylbmc: `%${filters.fylbmc}%` });
    }

    const [pageData, total] = await queryBuilder.getManyAndCount();

    return { pageData, total };
  }

  async findOne(jsdh: string, fylbid: string): Promise<H11Jsxb> {
    const found = await this.h11JsxbRepository.findOne({ where: { jsdh, fylbid } });

    if (!found) {
      throw new NotFoundException(`结算单号 ${jsdh} 和费用类别ID ${fylbid} 的记录不存在`);
    }

    return found;
  }

  async update(jsdh: string, fylbid: string, updateH11JsxbDto: UpdateH11JsxbDto): Promise<H11Jsxb> {
    const result = await this.h11JsxbRepository.update({ jsdh, fylbid }, updateH11JsxbDto);

    if (result.affected === 0) {
      throw new NotFoundException(`结算单号 ${jsdh} 和费用类别ID ${fylbid} 的记录不存在`);
    }

    return this.findOne(jsdh, fylbid);
  }

  async remove(jsdh: string, fylbid: string): Promise<void> {
    const result = await this.h11JsxbRepository.delete({ jsdh, fylbid });

    if (result.affected === 0) {
      throw new NotFoundException(`结算单号 ${jsdh} 和费用类别ID ${fylbid} 的记录不存在`);
    }
  }
}
