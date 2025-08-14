import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { h11_zybh } from './h11_zybh.entity';
import { log } from 'console';

@Injectable()
export class h11_zybhService {
  constructor(
    @InjectRepository(h11_zybh)
    private h11_zybhRepo: Repository<h11_zybh>,
  ) {}

  async findCurrentZYBH() {
    const result =
      (await this.h11_zybhRepo.findOne({
        where: { hsbz: 1 },
        select: ['zybh'],
      })) ||
      (await this.h11_zybhRepo.findOne({
        where: { hsbz: 0 },
        select: ['zybh'],
      }));
    return result;
  }
}
