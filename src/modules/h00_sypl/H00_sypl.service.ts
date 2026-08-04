import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { h00_sypl } from './h00_sypl.entity';

@Injectable()
export class h00_syplService {
  constructor(
    @InjectRepository(h00_sypl)
    private h00_syplRepo: Repository<h00_sypl>,
  ) {}

  findAll() {
    return this.h00_syplRepo.find({
      order: {
        szbm: 'ASC', // 升序排列，如果需要降序，可以改为 'DESC'
      },
    });
  }

  findOne(syplid: string) {
    return this.h00_syplRepo.findOne({ where: { syplid } });
  }
}
