import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { enr_jb01 } from './enr_jb01.entity';

@Injectable()
export class enr_jb01Service {
  constructor(
    @InjectRepository(enr_jb01)
    private readonly enrJb01Repo: Repository<enr_jb01>,
  ) {}

  findAll() {
    return this.enrJb01Repo.find({ order: { jbxh: 'DESC' } });
  }

  findOne(jbxh: string) {
    return this.enrJb01Repo.findOne({ where: { jbxh } });
  }

  findByFilter(params: { ksdm?: string; bqdm?: number; jblb?: number }) {
    return this.enrJb01Repo.find({
      where: {
        ...(params.ksdm != null && params.ksdm !== '' ? { ksdm: params.ksdm } : {}),
        ...(params.bqdm != null ? { bqdm: params.bqdm } : {}),
        ...(params.jblb != null ? { jblb: params.jblb } : {}),
      },
      order: { jbxh: 'DESC' },
    });
  }

  async create(dto: Partial<enr_jb01>) {
    const row = this.enrJb01Repo.create(dto);
    return this.enrJb01Repo.save(row);
  }

  async update(jbxh: string, dto: Partial<enr_jb01>) {
    await this.enrJb01Repo.update({ jbxh }, dto);
    return this.findOne(jbxh);
  }

  async remove(jbxh: string) {
    const res = await this.enrJb01Repo.delete({ jbxh });
    return res.affected ?? 0;
  }
}
