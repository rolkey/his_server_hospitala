
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { emr_jcff } from './emr_jcff.entity';
import { CreateDto, QueryDto, UpdateDto } from './dto';
import { CustomException } from '@/common/exceptions/custom.exception';
import { ERR } from '@/common/exceptions/error-code';
// import { gy_identityService } from '../gy_identity/gy_identity.service';
import { H00_xmzd } from '../h00_xmzd/h00_xmzd.entity';


@Injectable()
export class emr_jcffService {

  constructor(
    @InjectRepository(emr_jcff)
    private emr_jcffRepo: Repository<emr_jcff>,
    private dataSource: DataSource,
  ) { }

}
