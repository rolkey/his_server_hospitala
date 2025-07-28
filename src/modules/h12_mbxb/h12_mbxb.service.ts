// src/h12_mbxb/h12_mbxb.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { H12_mbxb } from './h12_mbxb.entity';
import {
  CreateH12_mbxbDto,
  UpdateH12_mbxbDto,
  QueryH12_mbxbDto,
  H12_mbxbResponseDto,
} from './h12_mbxb.dto';

@Injectable()
export class H12_mbxbService {
  constructor(
    @InjectRepository(H12_mbxb)
    private readonly h12MbxbRepository: Repository<H12_mbxb>,
  ) {}

  async findAll(queryDto: QueryH12_mbxbDto) {
    const pageSize = queryDto.pageSize || 10;
    const pageNo = queryDto.pageNo || 1;
    const [pageData, total] = await this.h12MbxbRepository.findAndCount({
      where: { mbid: queryDto.mbid },
      take: pageSize,
      skip: (pageNo - 1) * pageSize,
    });
    return { pageData, total };
  }

  async findOne(mbid: string, mblx: number, mxxh: number): Promise<H12_mbxbResponseDto | null> {
    const item = await this.h12MbxbRepository.findOne({ where: { mbid, mblx, mxxh } });
    return item ? this.toResponseDto(item) : null;
  }

  async create(createDto: CreateH12_mbxbDto): Promise<H12_mbxbResponseDto> {
    const newItem = this.h12MbxbRepository.create(createDto);
    const savedItem = await this.h12MbxbRepository.save(newItem);
    return this.toResponseDto(savedItem);
  }

  async update(
    mbid: string,
    mblx: number,
    mxxh: number,
    updateDto: UpdateH12_mbxbDto,
  ): Promise<H12_mbxbResponseDto | null> {
    await this.h12MbxbRepository.update({ mbid, mblx, mxxh }, updateDto);
    const updatedItem = await this.h12MbxbRepository.findOne({ where: { mbid, mblx, mxxh } });
    return updatedItem ? this.toResponseDto(updatedItem) : null;
  }

  async delete(mbid: string, mblx: number, mxxh: number): Promise<void> {
    await this.h12MbxbRepository.delete({ mbid, mblx, mxxh });
  }

  private toResponseDto(item: H12_mbxb): H12_mbxbResponseDto {
    return {
      mblx: item.mblx,
      mbid: item.mbid,
      mxxh: item.mxxh,
      xmid: item.xmid,
      xmmc: item.xmmc,
      jfyl: item.jfyl,
      sjyl: item.sjyl,
      syffid: item.syffid,
      syplid: item.syplid,
      xmgg: item.xmgg,
      xmdw: item.xmdw,
      xmdj: item.xmdj,
      typbz: item.typbz,
      tcbz: item.tcbz,
      scdh: item.scdh,
      fylbid: item.fylbid,
      sfje: item.sfje,
      sfbz: item.sfbz,
      fybz: item.fybz,
      bzxx: item.bzxx,
      zflx: item.zflx,
      xmzl: item.xmzl,
      cjid: item.cjid,
      scph: item.scph,
      pfjg: item.pfjg,
      szbz: item.szbz,
      sjyl1: item.sjyl1,
      mrcs: item.mrcs,
      bz1: item.bz1,
      bz2: item.bz2,
      jldw: item.jldw,
      gsid: item.gsid,
      ypfl: item.ypfl,
      dwjb: item.dwjb,
      kyfs: item.kyfs,
      yzzh: item.yzzh,
      yzmxxh: item.yzmxxh,
      qt1: item.qt1,
      ltbz: item.ltbz,
    };
  }
}
