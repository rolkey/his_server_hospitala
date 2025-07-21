import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { fyxx } from './fyxx.entity';

@Injectable()
export class fyxxService {
  constructor(
    @InjectRepository(fyxx)
    private fyxxRepo: Repository<fyxx>,
  ) {}

  findAll() {
    return this.fyxxRepo.find({ relations: { ksmcs: true } });
  }
}
