// src/h00_tcxb_zyfj/service/h00-tcxb-zyfj.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { H00TcxbZyfj } from '../entity/h00_tcxb_zyfj.entity';
import { QueryH00TcxbZyfjDto } from '../dto/h00_tcxb_zyfj.dto';

@Injectable()
export class H00TcxbZyfjService {
  constructor(
    @InjectRepository(H00TcxbZyfj)
    private readonly h00TcxbZyfjRepository: Repository<H00TcxbZyfj>,
  ) {}

  async findAll(queryDto?: QueryH00TcxbZyfjDto): Promise<H00TcxbZyfj[]> {
    const query = this.h00TcxbZyfjRepository.createQueryBuilder('h00_tcxb_zyfj');

    if (queryDto) {
      Object.keys(queryDto).forEach((key) => {
        if (key !== 'pageNo' && key !== 'pageSize' && queryDto[key] !== undefined) {
          query.andWhere(`h00_tcxb_zyfj.${key} = :${key}`, { [key]: queryDto[key] });
        }
      });

      if (queryDto.pageNo && queryDto.pageSize) {
        query.skip((queryDto.pageNo - 1) * queryDto.pageSize);
        query.take(queryDto.pageSize);
      }
    }

    return query.getMany();
  }

  async findOne(tcid: string, mxxh: number): Promise<H00TcxbZyfj | null> {
    return this.h00TcxbZyfjRepository.findOne({
      where: { tcid, mxxh },
    });
  }

  async findByTcid(tcid: string): Promise<H00TcxbZyfj[]> {
    return this.h00TcxbZyfjRepository.find({
      where: { tcid },
    });
  }
}
