import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDto } from './dto/h13_djdy.dto';
import { h13_djdy } from './h13_djdy.entity';

@Injectable()
export class h13_djdyService {
  constructor(
    @InjectRepository(h13_djdy)
    private h13_djdyRepo: Repository<h13_djdy>,
  ) { }

  findAll() {
    return this.h13_djdyRepo.find({});
  }

  async create(dto: CreateDto) {
    if (!dto.list?.length) {
      return [];
    }

    // 每条必须提供 maxid 或 mxxh 其一，写入表 maxid 字段；maxid 为 null 时用 mxxh
    const listWithMaxid = dto.list.map((item, index) => {
      const maxid = item.maxid ?? item.mxxh ?? null;
      if (maxid == null || (typeof maxid === 'number' && Number.isNaN(maxid))) {
        throw new BadRequestException(
          `list[${index}] 必须提供 maxid 或 mxxh（整数），不能为空`,
        );
      }
      return { ...item, _maxid: maxid };
    });

    const existing = await this.h13_djdyRepo.find({
      where: listWithMaxid.map((item) => ({ pblx: item.pblx, maxid: item._maxid })),
      select: ['pblx', 'maxid'],
    });
    const existingKeySet = new Set(existing.map((r) => `${r.pblx}_${r.maxid}`));

    const entities: h13_djdy[] = [];
    for (const item of listWithMaxid) {
      if (existingKeySet.has(`${item.pblx}_${item._maxid}`)) continue;
      const e = this.h13_djdyRepo.create();
      e.pblx = item.pblx ?? '';
      e.maxid = item._maxid;
      e.zyid = item.zyid ?? '';
      e.dyflid = item.dyflid ?? ''; // 表不允许 NULL，用空串
      e.czry = item.czry ?? '';
      e.dybz = 1;
      e.czrq = new Date();
      entities.push(e);
    }

    if (entities.length === 0) {
      return [];
    }
    return this.h13_djdyRepo.save(entities);
  }
}
