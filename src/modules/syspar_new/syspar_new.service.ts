
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { syspar_new } from './syspar_new.entity';
import { syspar } from './syspar.entity';

import { ERR } from '@/common/exceptions/error-code';
import { QueryDto } from './dto';
import { CustomException } from '@/common/exceptions/custom.exception';

@Injectable()
export class syspar_newService {



  constructor(
    @InjectRepository(syspar_new)
    private syspar_newRepo: Repository<syspar_new>,
    @InjectRepository(syspar)
    private sysparRepo: Repository<syspar>,
    private dataSource: DataSource,
  ) { }

  async getRegisterMode() {
    let syspar = await this.syspar_newRepo.findOne({ where: { prid: 'NEW_RegisterMode', syid: '99' } })
    if (!syspar) {
      syspar = new syspar_new();
      syspar.pnam = '门诊挂号新系统模式0不开启预约，1开启预约'
      syspar.syid = '99'
      syspar.prid = 'NEW_RegisterMode'
      syspar.pval = '0'
      await this.syspar_newRepo.save(syspar);
    }
    return { value: syspar.pval ? syspar.pval.trim() : '0' }
  }

  async findOrCreateDefaultPharmacy(ksid: string) {

    const defaultTypes = [
      { code: 'XY', pnam: '西药', pval: '0603' },
      { code: 'CY', pnam: '成药', pval: '0603' },
      { code: 'ZY', pnam: '中药', pval: '0604' },
      { code: 'CL', pnam: '材料', pval: '0603' },
      { code: 'QT', pnam: '其他', pval: '0603' },
      { code: 'ZJ', pnam: '针剂', pval: '0603' },
      { code: 'SS', pnam: '手术材料', pval: '0603' },
      { code: 'JP', pnam: '放射材料', pval: '0603' },
      { code: 'HL', pnam: '检验材料', pval: '0603' },
    ];
    const pridList = defaultTypes.map(t => `${t.code}${ksid}`);

    // 1️⃣ 查询现有记录
    const existing = await this.sysparRepo.find({
      where: {
        syid: '23',
        prid: In(pridList),
      }
    });

    // 2️⃣ 找出缺失的类型

    const existingPrids = existing.map(e => e.prid);

    const missingPrids = defaultTypes.filter(t => !existingPrids.includes(`${t.code}${ksid}`));

    // 3️⃣ 自动创建缺失记录
    if (missingPrids.length > 0) {

      const newRecords = missingPrids.map(t => ({
        syid: '23',
        prid: `${t.code}${ksid}`,
        pval: t.pval,
        pnam: `${t.pnam}${ksid}`
        // 根据你的表结构填其他必要字段
      }));

      await this.sysparRepo.save(newRecords);
    }

    // 4️⃣ 返回最终完整结果
    return this.sysparRepo.find({
      where: {
        syid: '23',
        prid: In(pridList)
      }
    });
  }

  async findAutoDiagnosisFee() {

    // 1️⃣ 查询现有记录
    const existing = await this.sysparRepo.findOne({
      where: {
        syid: '23',
        prid: 'zcyxbz',
      }
    });

    // 3️⃣ 自动创建缺失记录
    if (!existing) {
      await this.sysparRepo.save({
        syid: '23',
        prid: 'zcyxbz',
        pnam: '允许自动诊查',
        pval: '0'
      });
    }
    // 4️⃣ 返回最终完整结果
    return this.sysparRepo.findOne({
      where: {
        syid: '23',
        prid: 'zcyxbz',
      }
    });
  }

  async findOne(syid: string, prid: string) {
    return this.sysparRepo.findOne({
      where: {
        syid: syid,
        prid: prid
      }
    });
  }
  async findNewOne(syid: string, prid: string, manager?: EntityManager) {
    const where = {
      syid: syid,
      prid: prid
    }
    return manager ? manager.findOne(syspar_new, { where }) :
      this.syspar_newRepo.findOne({ where });
  }
  async updateNew(syid: string, prid: string, pval: string) {
    await this.syspar_newRepo.update({ syid, prid, }, { pval });
  }
  findSysparAll(queryDto: QueryDto) {
    const prids = queryDto.prid.split(',')
    return this.sysparRepo.find({
      where: {
        syid: queryDto.syid,
        prid: In([...prids])
      }
    });
  }

  async saveDefaultPharmacy(data: syspar[]) {
    await this.dataSource.transaction(async (manager) => {

      try {

        await manager.delete(syspar, { syid: '23', prid: In([...data.map(item => item.prid)]) });

        await manager.save(syspar, data);

      } catch (error) {
        console.error(error);
        throw new CustomException(ERR.ERR_10000, error.message ?? '保存失败');
      }
    });

  }
}
