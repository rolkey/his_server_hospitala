// src/lis_sflb/lis_sflb.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lis_sflb } from './lis_sflb.entity';
import {
  CreateLisSflbDto,
  UpdateLisSflbDto,
  QueryLisSflbDto,
  LisSflbResponseDto,
} from './lis_sflb.dto';

@Injectable()
export class Lis_sflbService {
  constructor(
    @InjectRepository(Lis_sflb)
    private readonly lisSflbRepository: Repository<Lis_sflb>,
  ) {}

  async findAll(): Promise<LisSflbResponseDto[]> {
    const items = await this.lisSflbRepository.find();
    return items.map((item) => this.toResponseDto(item));
  }

  async findOne(lbcode: string): Promise<LisSflbResponseDto | null> {
    const item = await this.lisSflbRepository.findOne({ where: { lbcode } });
    return item ? this.toResponseDto(item) : null;
  }

  async create(createDto: CreateLisSflbDto): Promise<LisSflbResponseDto> {
    const newItem = this.lisSflbRepository.create(createDto);
    const savedItem = await this.lisSflbRepository.save(newItem);
    return this.toResponseDto(savedItem);
  }

  async update(lbcode: string, updateDto: UpdateLisSflbDto): Promise<LisSflbResponseDto | null> {
    await this.lisSflbRepository.update(lbcode, updateDto);
    const updatedItem = await this.lisSflbRepository.findOne({ where: { lbcode } });
    return updatedItem ? this.toResponseDto(updatedItem) : null;
  }

  async delete(lbcode: string): Promise<void> {
    await this.lisSflbRepository.delete(lbcode);
  }

  private toResponseDto(item: Lis_sflb): LisSflbResponseDto {
    return {
      lbcode: item.lbcode,
      lbname: item.lbname,
      pybm: item.pybm,
      wbbm: item.wbbm,
      qtbm: item.qtbm,
      fylbid: item.fylbid,
      zxksid: item.zxksid,
      yxbz: item.yxbz,
      bz1: item.bz1,
      bz2: item.bz2,
    };
  }
}
