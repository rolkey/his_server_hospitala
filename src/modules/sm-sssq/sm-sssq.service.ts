import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, EntityManager, Transaction, In, Not } from 'typeorm';
import { SmSssq } from './sm-sssq.entity';
import { CreateSmSssqDto, UpdateSmSssqDto, QuerySmSssqDto } from './dto/sm-sssq.dto';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';
import { GyIdentityService } from '../gy_identity/gy-identity.service';
import { h12_yzxb } from '../h12_yzzb/h12_yzxb.entity';
import { h12_yzxbService } from '../h12_yzzb/h12_yzxb.service';
import { Mzff } from '../mzff/mzff.entity';
import DateFormater from '@/utils/DateFormater';

@Injectable()
export class SmSssqService {
  constructor(
    @InjectRepository(h11_brxx)
    private readonly h11BrxxRepository: Repository<h11_brxx>,
    @InjectRepository(h12_yzxb)
    private readonly h12YzxbRepository: Repository<h12_yzxb>,
    @InjectRepository(Mzff)
    private readonly mzffRepository: Repository<Mzff>,
    @InjectRepository(SmSssq)
    private readonly smSssqRepository: Repository<SmSssq>,
    private readonly gyIdentityService: GyIdentityService,
    private readonly entityManager: EntityManager,
    private readonly h12YzxbService: h12_yzxbService,
  ) {}

  async create(createDto: CreateSmSssqDto): Promise<void> {
    const smSssq = this.smSssqRepository.create(createDto);
    try {
      return await this.createSmSssq(smSssq);
    } catch (error) {
      console.error('保存手术出错：', error);
      throw error;
    }
  }

  async createSmSssq(smSssq: SmSssq): Promise<void> {
    // 验证病人信息
    const patientInfo = await this.validatePatient(smSssq.zyid || '');

    // 设置病人基本信息
    smSssq.zyh = patientInfo.zybh;

    // 验证必填字段
    this.validateRequiredFields(smSssq);

    // 验证日期
    this.validateDates(smSssq.sqrq, smSssq.ssrq);

    smSssq.sqdh = await this.gyIdentityService.getMax('SM_SSSQ');

    // 设置手术室信息
    return await this.entityManager.transaction(async (transactionalEntityManager) => {
      smSssq.txks = patientInfo.cyksid;
      const h12Yzxb = await this.createMedicalOrders(smSssq, transactionalEntityManager);
      smSssq.bzxx5 = h12Yzxb.mxxh?.toString();

      await transactionalEntityManager.save(smSssq);
    });
  }

  async updateSmSssq(updateData: UpdateSmSssqDto): Promise<void> {
    // 验证病人信息
    const patientInfo = await this.validatePatient(updateData.zyid || '');

    // 获取原始数据
    const originalData = await this.smSssqRepository.findOne({ where: { sqdh: updateData.sqdh } });
    if (!originalData) {
      throw new Error('手术申请不存在!');
    }

    // 合并更新数据
    const updatedData = { ...originalData, ...updateData };

    // 设置病人基本信息
    updatedData.zyh = patientInfo.zybh;
    updatedData.txks = patientInfo.cyksid;

    // 验证必填字段
    this.validateRequiredFields(updatedData);

    // 验证日期
    this.validateDates(updatedData.sqrq, updatedData.ssrq);

    return await this.entityManager.transaction(async (transactionalEntityManager) => {
      await Promise.all([
        // 更新医嘱信息
        transactionalEntityManager.update(
          h12_yzxb,
          { zyid: updatedData.zyid, scdh: updatedData.sqdh.toString(), xmid: '0000000' },
          { xmmc: await this.getSsmc(updatedData) },
        ),
        transactionalEntityManager.save(SmSssq, updatedData),
      ]);
    });
  }

  private async getSsmc(smSssq: SmSssq): Promise<string> {
    const mzff = await this.mzffRepository.findOne({ where: { mzid: smSssq.mzdm } });
    return `拟于${DateFormater.formatDate2(smSssq.ssrq)}在${mzff?.mzffmc}下行${smSssq.ssnm}`;
  }

  async validatePatient(zyid: string): Promise<h11_brxx> {
    const patientInfo = await this.h11BrxxRepository.findOne({
      where: { zyid },
    });

    if (!patientInfo) {
      throw new Error('病人不存在，请重新输入!');
    }

    return patientInfo;
  }

  validateRequiredFields(smSssq: SmSssq): void {
    const requiredFields = [
      { field: 'ssks', name: '手术科室' },
      { field: 'ssys', name: '手术医师' },
      { field: 'ssdm', name: '手术名称' },
      { field: 'sqks', name: '申请科室' },
      { field: 'mzdm', name: '麻醉方法' },
      { field: 'mzys', name: '麻醉医生' },
    ];

    for (const { field, name } of requiredFields) {
      if (!smSssq[field]) {
        throw new Error(`请选择${name}!`);
      }
    }
  }

  validateDates(sqrq: Date, ssrq: Date): void {
    if (sqrq > ssrq) {
      throw new Error('申请日期不能大于申请手术日期!');
    }
  }

  private async createMedicalOrders(smSssq: SmSssq, manager: EntityManager): Promise<h12_yzxb> {
    const currentTime = new Date();

    // 获取最大序号
    const maxMxxh = await this.gyIdentityService.getMax('h12_yzxbn');
    const maxYzzh = await this.gyIdentityService.getMax('h12_yzzh');

    // const mzff = await this.mzffRepository.findOne({ where: { mzid: smSssq.mzdm } });

    const h12Yzxb = await this.h12YzxbService.createAdvice({
      zyid: smSssq.zyid,
      yzlx: 2,
      newGroup: true,
      newZxcs: true,
    });

    // 创建第一条医嘱
    Object.assign(h12Yzxb, {
      zybh: smSssq.zyh,
      xmid: '0000000',
      xmmc: await this.getSsmc(smSssq),
      jfyl: 1,
      sjyl: 1,
      syffid: '',
      syplid: 'QD',
      xmgg: '',
      xmdw: '',
      xmdj: 0,
      typbz: '',
      ksys: smSssq.czgh,
      kshs: '',
      fylbid: '35',
      sfje: 0,
      sjbz: 0,
      sfbz: 1,
      jsbz: 1,
      zxbz: 0,
      tzbz: 0,
      fybz: '0',
      lryid: smSssq.czgh,
      hdbz: 1,
      tpbz: 0,
      scdh: smSssq.sqdh.toString(),
      zflx: '0',
      xmzl: 1,
      tybz: 0,
      kyts: 1,
      clbz: 0,
      ypid: '0000000',
      ksid: smSssq.sqks,
      yzzh: maxYzzh,
      ysbz: 1,
      srcs: 0,
      yzrq: currentTime,
      tjbz: 1,
      yzzt: 0,
    });

    return await manager.save(h12_yzxb, h12Yzxb);
  }

  async findAll(queryDto: QuerySmSssqDto): Promise<SmSssq[]> {
    const { pageNo = 1, pageSize = 10, sortBy, sortOrder = 'ASC', ...rest } = queryDto;
    const where = {};

    // Build dynamic where conditions
    Object.keys(rest).forEach((key) => {
      if (rest[key] !== undefined && rest[key] !== null) {
        where[key] = rest[key];
      }
    });

    const order = { sqrq: 'DESC' as const };

    return await this.smSssqRepository.find({
      where,
      order,
      relations: [
        'h11BrxxEntity',
        'h11BrxxEntity.brlxidEntity',
        'h11BrxxEntity.mzysEntity',
        'jbbmicd10Entity', // 疾病编码
        'mzdmEntity', // 麻醉方法
      ],
    });
  }

  async findOne(sqdh: number): Promise<SmSssq> {
    return await this.smSssqRepository.findOne({
      where: { sqdh },
    });
  }

  async remove(data: { zyid: string; sqdh: string }): Promise<void> {
    const { zyid, sqdh } = data;
    return await this.entityManager.transaction(async (transactionalEntityManager) => {
      // 检查 h12_yzxb中yzzt是否有不为0的，不为0要抛出异常禁止删除
      const yzxb = await transactionalEntityManager.findOne(h12_yzxb, {
        where: { zyid, scdh: In(sqdh.split(',')), yzzt: Not(0) },
      });
      if (yzxb) {
        throw new Error('该手术申请已提交，无法删除！！');
      }
      await Promise.all([
        transactionalEntityManager.delete(h12_yzxb, {
          scdh: In(sqdh.split(',')),
          zyid,
          xmid: '0000000',
        }),
        transactionalEntityManager.delete(SmSssq, { sqdh: In(sqdh.split(',')), zyid }),
      ]);
    });
  }
}
