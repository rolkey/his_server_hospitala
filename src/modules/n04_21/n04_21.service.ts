import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { N0421 } from './n04_21.entity';

/** 病案首页详情查询字段，与 N04_21 按 zyid 查询 SQL 一致 */
const N0421_DETAIL_FIELDS: (keyof N0421)[] = [
  'zyid',
  'usercode',
  'username',
  'ylfkfs',
  'jkkh',
  'zycs',
  'bah',
  'xm',
  'xb',
  'csrq',
  'nl',
  'gj',
  'bzyzs_nl',
  'xsetz',
  'xserytz',
  'csd1',
  'csd2',
  'csd3',
  'gg1',
  'gg2',
  'gg3',
  'mz',
  'sfzh',
  'zy',
  'hy',
  'xzz1',
  'xzz2',
  'xzz3',
  'dh',
  'yb1',
  'hkdz1',
  'hkdz2',
  'hkdz3',
  'yb2',
  'gzdwjdz',
  'dwdh',
  'yb3',
  'lxrxm',
  'gx',
  'dz',
  'dh1',
  'rytj',
  'zllb',
  'rysj',
  'rysj_s',
  'rykb',
  'rybf',
  'zkkb',
  'cysj',
  'cysj_s',
  'cykb',
  'cybf',
  'sjzy',
  'mzd_zyzd',
  'jbdm',
  'mzzd_xyzd',
  'jbbm',
  'sslclj',
  'zyyj',
  'zyzlsb',
  'zyzljs',
  'bzsh',
  'wbyy',
  'jbbm1',
  'blzd',
  'jbbm2',
  'blh',
  'ywgm',
  'gmyw',
  'sj',
  'xx',
  'rh',
  'kzr',
  'zrys',
  'zzys',
  'zyys',
  'zrhs',
  'jxys',
  'sxys',
  'bmy',
  'bazl',
  'zkys',
  'zkhs',
  'zkrq',
  'lyfs',
  'yzzy_jgmc',
  'wsy_jgmc',
  'zzyjh',
  'md',
  'ryq_t',
  'ryq_xs',
  'ryq_fz',
  'ryh_t',
  'ryh_xs',
  'ryh_fz',
  'fzr',
  'tjfzr',
  'lxdh',
  'riqi',
  'zybh',
  'sjbz',
  'nldw',
  'bzxx',
  'bzxx1',
  'jdrq',
  'xhxb',
  'xxxb',
  'xxj',
  'xqx',
  'xqt',
  'qzrq',
  'srqz',
  'mzcy',
  'rycy',
  'sqsh',
  'lcbl',
  'fxbl',
  'bajl',
  'zrb',
  'shss',
  'shsr',
  'shxj',
  'ry48',
  'shks',
  'zczy',
  'cyfs',
  'blfx',
  'bz1',
  'szbz',
  'sscs',
  'sscg',
  'bz2',
  'bz3',
  'bz4',
  'bz5',
  'xzz4',
  'xzz5',
  'hkdz4',
  'hkdz5',
  'xzdz',
  'hkdz',
  'tjbz',
  'drgbz',
  'shbz',
  'shry',
  'shrq',
  'hbsag',
  'hcvab',
  'hivab',
  'ryzdicd',
  'ryzdmc',
  'ryblfx',
  'bld_cat',
  'bld_unt',
  'bld_amt',
  'bz6',
  'thl',
  'yhl',
  'ehl',
  'shl',
  'sflx',
  'sslclj1',
  'bz7',
  'mzys',
  'blsm',
];

@Injectable()
export class N0421Service {
  constructor(
    @InjectRepository(N0421)
    private readonly n0421Repository: Repository<N0421>,
  ) {}

  async create(data: Partial<N0421>): Promise<N0421> {
    const entity = this.n0421Repository.create(data);
    return await this.n0421Repository.save(entity);
  }

  async findByCondition(condition: Partial<N0421>): Promise<N0421[]> {
    return await this.n0421Repository.find({ where: condition });
  }

  async findByZyid(zyid: string): Promise<Partial<N0421>> {
    const selectFields = N0421_DETAIL_FIELDS.map((field) => `n04_21.${field}`);
    const record = await this.n0421Repository
      .createQueryBuilder('n04_21')
      .select(selectFields)
      .where('n04_21.zyid = :zyid', { zyid })
      .getOne();

    if (!record) {
      throw new NotFoundException(`住院ID ${zyid} 对应的病案首页不存在`);
    }

    return record;
  }

  async findOne(zyid: string): Promise<Partial<N0421>> {
    return this.findByZyid(zyid);
  }

  async update(zyid: string, data: Partial<N0421>): Promise<Partial<N0421>> {
    const { zyid: _, ...updateData } = data;
    const result = await this.n0421Repository.update({ zyid }, updateData);
    if (result.affected === 0) {
      throw new NotFoundException(`住院ID ${zyid} 对应的病案首页不存在`);
    }
    return this.findOne(zyid);
  }

  async save(data: Partial<N0421>): Promise<Partial<N0421> | N0421> {
    const { zyid } = data;
    if (!zyid) {
      throw new NotFoundException('住院ID不能为空');
    }
    const existing = await this.n0421Repository.findOne({ where: { zyid } });
    if (existing) {
      await this.n0421Repository.update({ zyid }, data);
      return this.findOne(zyid);
    }
    return this.create(data);
  }

  async remove(zyid: string): Promise<void> {
    const result = await this.n0421Repository.delete({ zyid });
    if (result.affected === 0) {
      throw new NotFoundException(`住院ID ${zyid} 对应的病案首页不存在`);
    }
  }
}
