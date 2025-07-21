import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { zcmc } from './zcmc.entity';

@Injectable()
export class zcmcService {
  constructor(
    @InjectRepository(zcmc)
    private zcmcRepo: Repository<zcmc>,
  ) {}

  findAll() {
    return this.zcmcRepo.find({});
  }
}
