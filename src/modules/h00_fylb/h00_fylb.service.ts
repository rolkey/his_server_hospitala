import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { h00_fylb } from './h00_fylb.entity';

@Injectable()
export class h00_fylbService {
  constructor(
    @InjectRepository(h00_fylb)
    private h00_fylbRepo: Repository<h00_fylb>,
  ) { }

  findAll() {
    return this.h00_fylbRepo.find({});
  }

  async findOne(fylbid: string) {
    return this.h00_fylbRepo.findOne({ where: { fylbid } });
  }
}
