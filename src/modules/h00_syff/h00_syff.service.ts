import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { h00_syff } from './h00_syff.entity';

@Injectable()
export class h00_syffService {
  constructor(
    @InjectRepository(h00_syff)
    private h00_syffRepo: Repository<h00_syff>,
  ) {}

  findAll() {
    return this.h00_syffRepo.find({});
  }
}
