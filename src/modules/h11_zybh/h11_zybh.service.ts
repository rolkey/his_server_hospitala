import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { h11_zybh } from './h11_zybh.entity';

@Injectable()
export class h11_zybhService {
  constructor(
    @InjectRepository(h11_zybh)
    private h11_zybhRepo: Repository<h11_zybh>,
  ) {}

  findOne() {
    return this.h11_zybhRepo.createQueryBuilder('h11_zybh').where('h11_zybh.hsbz = 1').getOne();
  }
}
