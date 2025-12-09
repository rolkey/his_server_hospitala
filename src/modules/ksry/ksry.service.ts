import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ksry } from './ksry.entity';

@Injectable()
export class KsryService {
  constructor(
    @InjectRepository(Ksry)
    private readonly repo: Repository<Ksry>,
  ) {}
}
