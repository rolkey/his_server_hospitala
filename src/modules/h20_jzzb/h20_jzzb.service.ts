import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { h20_jzzb } from './h20_jzzb.entity';

@Injectable()
export class h20_jzzbService {
  constructor(
    @InjectRepository(h20_jzzb)
    private h20_jzzbRepo: Repository<h20_jzzb>,
  ) {}

  findAll() {
    return this.h20_jzzbRepo.find({});
  }
}
