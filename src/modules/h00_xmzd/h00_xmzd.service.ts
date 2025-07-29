// H00_xmzdService.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { H00_xmzd } from './h00_xmzd.entity';

@Injectable()
export class H00_xmzdService {
  constructor(
    @InjectRepository(H00_xmzd)
    private readonly h00XmzdRepository: Repository<H00_xmzd>,
  ) {}

  async findAll() {
    return await this.h00XmzdRepository.find();
  }

  async findOne(xmzl: number, xmid: string, ggxh: string) {
    return await this.h00XmzdRepository.findOne({
      where: { xmzl, xmid, ggxh },
    });
  }
}
