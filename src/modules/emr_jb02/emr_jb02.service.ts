import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { emr_jb02 } from './emr_jb02.entity';

@Injectable()
export class emr_jb02Service {
  constructor(
    @InjectRepository(emr_jb02)
    private readonly emrJb02Repo: Repository<emr_jb02>,
  ) {}

  findAll() {
    return this.emrJb02Repo.find({ order: { jlxh: 'DESC' } });
  }

  findOne(jlxh: string) {
    return this.emrJb02Repo.findOne({ where: { jlxh } });
  }

  /** 按交接班序号查全部明细 */
  findByJbxh(jbxh: string) {
    return this.emrJb02Repo.find({
      where: { jbxh },
      order: { jlxh: 'ASC' },
    });
  }

  findByFilter(params: { jbxh?: string; zyh?: string; brch?: string }) {
    return this.emrJb02Repo.find({
      where: {
        ...(params.jbxh != null && params.jbxh !== '' ? { jbxh: params.jbxh } : {}),
        ...(params.zyh != null && params.zyh !== '' ? { zyh: params.zyh } : {}),
        ...(params.brch != null && params.brch !== '' ? { brch: params.brch } : {}),
      },
      order: { jlxh: 'DESC' },
    });
  }

  async create(dto: Partial<emr_jb02>) {
    const row = this.emrJb02Repo.create(dto);
    return this.emrJb02Repo.save(row);
  }

  async update(jlxh: string, dto: Partial<emr_jb02>) {
    await this.emrJb02Repo.update({ jlxh }, dto);
    return this.findOne(jlxh);
  }

  async remove(jlxh: string) {
    const res = await this.emrJb02Repo.delete({ jlxh });
    return res.affected ?? 0;
  }
}
