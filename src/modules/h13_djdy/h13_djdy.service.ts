import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { h13_djdy } from './h13_djdy.entity';

@Injectable()
export class h13_djdyService {
  constructor(
    @InjectRepository(h13_djdy)
    private h13_djdyRepo: Repository<h13_djdy>,
  ) { }

  findAll() {
    return this.h13_djdyRepo.find({});
  }
}
