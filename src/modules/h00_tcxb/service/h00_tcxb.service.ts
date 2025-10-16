// src/h00_tcxb/service/h00-tcxb.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { H00Tcxb } from '../entity/h00_tcxb.entity';
import { QueryH00TcxbDto } from '../dto/h00_tcxb.dto';
import { H00TcxbZyfj } from '../entity/h00_tcxb_zyfj.entity';
import { H00_xmzd } from '../../h00_xmzd/h00_xmzd.entity';
import { TcxbCombinedResponseDto } from '../dto/tcxb-combined-response.dto';
import { h00_syff } from '../../h00_syff/h00_syff.entity';

@Injectable()
export class H00TcxbService {
  constructor(
    @InjectRepository(H00Tcxb)
    private readonly h00TcxbRepository: Repository<H00Tcxb>,
    @InjectRepository(H00TcxbZyfj)
    private readonly h00TcxbZyfjRepository: Repository<H00TcxbZyfj>,
    // @InjectRepository(H00_xmzd)
    // private readonly h00XmzdRepository: Repository<H00_xmzd>,
    @InjectRepository(h00_syff)
    private readonly h00SyffRepository: Repository<h00_syff>,
  ) {}

  /**
   * Find all records with optional query parameters
   */
  async findAll(queryDto?: QueryH00TcxbDto): Promise<H00Tcxb[]> {
    const query = this.h00TcxbRepository.createQueryBuilder('h00_tcxb');

    if (queryDto) {
      // Add where conditions for each provided query parameter
      Object.keys(queryDto).forEach((key) => {
        if (key !== 'pageNo' && key !== 'pageSize' && queryDto[key] !== undefined) {
          query.andWhere(`h00_tcxb.${key} = :${key}`, { [key]: queryDto[key] });
        }
      });

      // Add pagination if provided
      if (queryDto.pageNo && queryDto.pageSize) {
        query.skip((queryDto.pageNo - 1) * queryDto.pageSize);
        query.take(queryDto.pageSize);
      }
    }

    return query.getMany();
  }

  /**
   * Find records by tcid
   */
  async findByTcid(tcid: string): Promise<H00Tcxb[]> {
    return this.h00TcxbRepository.find({
      where: { tcid },
    });
  }

  async findBySyffid(syffid: string): Promise<H00Tcxb[]> {
    const h00_syff_val = await this.h00SyffRepository.findOne({
      where: { syffid },
    });
    return this.findByTcid(h00_syff_val?.xmid?.trim());
  }

  async getCombinedData(tcid: string): Promise<TcxbCombinedResponseDto[]> {
    // First query - h00_tcxb with h00_xmzd
    const query1 = this.h00TcxbRepository
      .createQueryBuilder('tcxb')
      .innerJoin(H00_xmzd, 'xmzd', 'tcxb.xmid = xmzd.xmid')
      .select([
        'tcxb.tcid as tcid',
        'tcxb.mxxh as mxxh',
        'tcxb.xmid as xmid',
        'tcxb.xmmc as xmmc',
        'tcxb.dwzl as dwzl',
        'tcxb.jldw as jldw',
        'tcxb.jldj as jldj',
        'tcxb.jlsl as jlsl',
        'tcxb.slsx as slsx',
        'tcxb.slxx as slxx',
        'tcxb.sfbz as sfbz',
        'tcxb.xzbz as xzbz',
        'tcxb.fybz as fybz',
        'tcxb.fylbid as fylbid',
        'tcxb.cjid as cjid',
        'tcxb.scph as scph',
        'tcxb.pfjg as pfjg',
        'tcxb.xmgg as xmgg',
        'tcxb.zflx as zflx',
        'tcxb.jldw as xmdw',
        'CAST(tcxb.jlsl AS VARCHAR) as sjyl1',
        "'' as typbz",
        '1 as kyts',
        '1 as kyfs',
        'tcxb.ltbz as ltbz',
        'xmzd.tcmc as tcmc',
        'tcxb.xmzl as xmzl',
        'xmzd.zflx as ybfl',
        'xmzd.ypfl as xnfl',
        'xmzd.tczfblid as zxks',
        'xmzd.gjybbm as gjybbm',
        'xmzd.gjybmc as gjybmc',
      ])
      .where('tcxb.tcid = :tcid', { tcid })
      .andWhere('xmzd.yxbz = 1');

    // Second query - h00_tcxb_zyfj with h00_xmzd
    const query2 = this.h00TcxbZyfjRepository
      .createQueryBuilder('zyfj')
      .innerJoin(H00_xmzd, 'xmzd', 'zyfj.xmid = xmzd.xmid')
      .select([
        'zyfj.tcid as tcid',
        'zyfj.mxxh as mxxh',
        'zyfj.xmid as xmid',
        'zyfj.xmmc as xmmc',
        'zyfj.dwzl as dwzl',
        'zyfj.xmdw as jldw',
        'zyfj.jldj as jldj',
        'zyfj.jlsl as jlsl',
        'zyfj.slsx as slsx',
        'zyfj.slxx as slxx',
        'zyfj.sfbz as sfbz',
        'zyfj.xzbz as xzbz',
        'zyfj.fybz as fybz',
        'zyfj.fylbid as fylbid',
        'zyfj.cjid as cjid',
        'zyfj.scph as scph',
        'zyfj.pfjg as pfjg',
        'zyfj.xmgg as xmgg',
        'zyfj.zflx as zflx',
        'zyfj.jldw as xmdw',
        'zyfj.sjyl1 as sjyl1',
        'zyfj.typbz as typbz',
        'zyfj.kyts as kyts',
        'zyfj.kyfs as kyfs',
        'zyfj.ltbz as ltbz',
        'xmzd.tcmc as tcmc',
        'zyfj.xmzl as xmzl',
        'xmzd.zflx as ybfl',
        'xmzd.ypfl as xnfl',
        'xmzd.tczfblid as zxks',
        'xmzd.gjybbm as gjybbm',
        'xmzd.gjybmc as gjybmc',
      ])
      .where('zyfj.tcid = :tcid', { tcid })
      .andWhere('xmzd.yxbz = 1');

    // Execute both queries and combine results
    const [result1, result2] = await Promise.all([query1.getRawMany(), query2.getRawMany()]);

    // Combine results and map to DTO
    return [...result1, ...result2].map((item) => {
      const dto = new TcxbCombinedResponseDto();
      Object.assign(dto, item);
      return dto;
    });
  }
}
