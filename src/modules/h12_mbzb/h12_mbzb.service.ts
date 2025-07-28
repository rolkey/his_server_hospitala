// src/h12_mbzb/h12_mbzb.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { H12_mbzb } from './h12_mbzb.entity';
import { CreateH12_mbzbDto, UpdateH12_mbzbDto, H12_mbzbResponseDto } from './h12_mbzb.dto';

@Injectable()
export class H12_mbzbService {
  constructor(
    @InjectRepository(H12_mbzb)
    private readonly h12MbzbRepository: Repository<H12_mbzb>,
  ) {}

  async findAll(): Promise<H12_mbzbResponseDto[]> {
    const items = await this.h12MbzbRepository.find();
    return items.map((item) => this.toResponseDto(item));
  }

  async findOne(mbid: string, mblx: number): Promise<H12_mbzbResponseDto | null> {
    const item = await this.h12MbzbRepository.findOne({ where: { mbid, mblx } });
    return item ? this.toResponseDto(item) : null;
  }

  async create(createDto: CreateH12_mbzbDto): Promise<H12_mbzbResponseDto> {
    const newItem = this.h12MbzbRepository.create(createDto);
    const savedItem = await this.h12MbzbRepository.save(newItem);
    return this.toResponseDto(savedItem);
  }

  async update(
    mbid: string,
    mblx: number,
    updateDto: UpdateH12_mbzbDto,
  ): Promise<H12_mbzbResponseDto | null> {
    await this.h12MbzbRepository.update({ mbid, mblx }, updateDto);
    const updatedItem = await this.h12MbzbRepository.findOne({ where: { mbid, mblx } });
    return updatedItem ? this.toResponseDto(updatedItem) : null;
  }

  async delete(mbid: string, mblx: number): Promise<void> {
    await this.h12MbzbRepository.delete({ mbid, mblx });
  }

  private toResponseDto(item: H12_mbzb): H12_mbzbResponseDto {
    return {
      mbid: item.mbid,
      mblx: item.mblx,
      mbmc: item.mbmc,
      mbbz: item.mbbz,
      pybm: item.pybm,
      wbbm: item.wbbm,
      qtbm: item.qtbm,
      ksid: item.ksid,
      mbfl: item.mbfl,
      ysid: item.ysid,
      bz1: item.bz1,
      bz2: item.bz2,
      bz3: item.bz3,
    };
  }
}
