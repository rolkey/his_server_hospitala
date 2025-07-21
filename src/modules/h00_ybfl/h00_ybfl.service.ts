import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { h00_ybfl } from './h00_ybfl.entity';

@Injectable()
export class h00_ybflService {
  constructor(
    @InjectRepository(h00_ybfl)
    private h00_ybflRepo: Repository<h00_ybfl>,
  ) {}

  findAll() {
    return this.h00_ybflRepo.find({});
  }
}
