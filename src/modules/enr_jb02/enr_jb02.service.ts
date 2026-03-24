import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { enr_jb02 } from './enr_jb02.entity';

@Injectable()
export class enr_jb02Service {
  constructor(
    @InjectRepository(enr_jb02)
    private readonly enrJb02Repo: Repository<enr_jb02>,
  ) {}

  findAll() {
    return this.enrJb02Repo.find({ order: { jlxh: 'DESC' } });
  }

  findOne(jlxh: string) {
    return this.enrJb02Repo.findOne({ where: { jlxh } });
  }

  findByJbxh(jbxh: string) {
    return this.enrJb02Repo.find({
      where: { jbxh },
      order: { jlxh: 'ASC' },
    });
  }

  findByFilter(params: { jbxh?: string; zyh?: string; brch?: string }) {
    return this.enrJb02Repo.find({
      where: {
        ...(params.jbxh != null && params.jbxh !== '' ? { jbxh: params.jbxh } : {}),
        ...(params.zyh != null && params.zyh !== '' ? { zyh: params.zyh } : {}),
        ...(params.brch != null && params.brch !== '' ? { brch: params.brch } : {}),
      },
      order: { jlxh: 'DESC' },
    });
  }

  async create(dto: Partial<enr_jb02>) {
    const row = this.enrJb02Repo.create(dto);
    return this.enrJb02Repo.save(row);
  }

  async update(jlxh: string, dto: Partial<enr_jb02>) {
    await this.enrJb02Repo.update({ jlxh }, dto);
    return this.findOne(jlxh);
  }

  async remove(jlxh: string) {
    const res = await this.enrJb02Repo.delete({ jlxh });
    return res.affected ?? 0;
  }
}
