
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { emr_xmfl } from './emr_xmfl.entity';
// import { gy_identityService } from '../gy_identity/gy_identity.service';
import { CreateDto, QueryDto, UpdateDto } from './dto';
import { ERR } from '@/common/exceptions/error-code';
import { CustomException } from '@/common/exceptions/custom.exception';

@Injectable()
export class emr_xmflService {

}
