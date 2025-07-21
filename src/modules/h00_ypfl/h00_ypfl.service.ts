import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { h00_ypfl } from './h00_ypfl.entity';

@Injectable()
export class h00_ypflService {
  constructor(
    @InjectRepository(h00_ypfl)
    private h00_ypflRepo: Repository<h00_ypfl>,
  ) {}

  findAll() {
    return this.h00_ypflRepo.find({});
  }
}
