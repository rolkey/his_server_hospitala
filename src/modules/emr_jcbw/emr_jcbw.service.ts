import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { emr_jcbw } from './emr_jcbw.entity';

import { CustomException } from '@/common/exceptions/custom.exception';
import { ERR } from '@/common/exceptions/error-code';

@Injectable()
export class emr_jcbwService {
  constructor(
    @InjectRepository(emr_jcbw)
    private emr_jcbwRepo: Repository<emr_jcbw>,
    private dataSource: DataSource,
  ) {}
}
