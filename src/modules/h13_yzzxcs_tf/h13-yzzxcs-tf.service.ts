import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { H13YzzxcsTf } from './h13-yzzxcs-tf.entity';
import {
  CreateH13YzzxcsTfDto,
  UpdateH13YzzxcsTfDto,
  QueryH13YzzxcsTfDto,
} from './h13-yzzxcs-tf.dto';
import { QueryYzzxcsDto } from './dto/h13-yzzxcs-tf.dto';

@Injectable()
export class H13YzzxcsTfService {
  constructor(
    @InjectRepository(H13YzzxcsTf)
    private readonly h13YzzxcsTfRepository: Repository<H13YzzxcsTf>,
  ) {}

  async create(createDto: CreateH13YzzxcsTfDto): Promise<H13YzzxcsTf> {
    const entity = this.h13YzzxcsTfRepository.create(createDto);
    return await this.h13YzzxcsTfRepository.save(entity);
  }

  async findOne(primaryKey: {
    yzlx: number;
    yzxh: number;
    mxxh: number;
    zyid: string;
    zxrq: Date;
  }): Promise<H13YzzxcsTf | null> {
    return await this.h13YzzxcsTfRepository.findOne({
      where: primaryKey,
    });
  }

  async findAll(queryDto: QueryH13YzzxcsTfDto) {
    const { pageNo = 1, pageSize = 10, ...queryParams } = queryDto;
    const skip = (pageNo - 1) * pageSize;

    const [results, total] = await this.h13YzzxcsTfRepository.findAndCount({
      where: queryParams,
      skip,
      take: pageSize,
    });

    return {
      data: results,
      total,
      pageNo,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * 医嘱费用查询
   * @param params 医嘱信息
   * @returns
   */
  async queryYzzxcs(params: QueryYzzxcsDto): Promise<H13YzzxcsTf[]> {
    const { zyid, yzxh, yzlx, yzzh } = params;
    return await this.h13YzzxcsTfRepository.find({
      where: {
        zyid,
        yzxh,
        yzlx,
        yzzh,
      },
      relations: ['h00XmzdEntiry'],
      select: {
        h00XmzdEntiry: {
          xmmc: true,
        },
      },
    });
  }

  async update(
    primaryKey: {
      yzlx: number;
      yzxh: number;
      mxxh: number;
      zyid: string;
      zxrq: Date;
    },
    updateDto: UpdateH13YzzxcsTfDto,
  ): Promise<H13YzzxcsTf | null> {
    await this.h13YzzxcsTfRepository.update(primaryKey, updateDto);
    return this.findOne(primaryKey);
  }

  async remove(primaryKey: {
    yzlx: number;
    yzxh: number;
    mxxh: number;
    zyid: string;
    zxrq: Date;
  }): Promise<void> {
    await this.h13YzzxcsTfRepository.delete(primaryKey);
  }
}
