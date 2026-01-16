import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, EntityManager } from 'typeorm';
import { SmSssq } from './sm-sssq.entity';
import { CreateSmSssqDto, UpdateSmSssqDto, QuerySmSssqDto } from './dto/sm-sssq.dto';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';
import { GyIdentityService } from '../gy_identity/gy-identity.service';
import { h12_yzxb } from '../h12_yzzb/h12_yzxb.entity';
import { h12_yzxbService } from '../h12_yzzb/h12_yzxb.service';
import { Mzff } from '../mzff/mzff.entity';

@Injectable()
export class SmSssqService {
  constructor(
    @InjectRepository(h11_brxx)
    private readonly h11BrxxRepository: Repository<h11_brxx>,
    // @InjectRepository(h12_yzxb)
    // private readonly h12YzxbRepository: Repository<h12_yzxb>,
    @InjectRepository(Mzff)
    private readonly mzffRepository: Repository<Mzff>,
    @InjectRepository(SmSssq)
    private readonly smSssqRepository: Repository<SmSssq>,
    private readonly gyIdentityService: GyIdentityService,
    private readonly entityManager: EntityManager,
    private readonly h12YzxbService: h12_yzxbService,
  ) {}

  async create(createDto: CreateSmSssqDto): Promise<SmSssq> {
    const smSssq = this.smSssqRepository.create(createDto);
    try {
      return await this.createSmSssq(smSssq);
    } catch (error) {
      console.error('保存手术出错：', error);
      throw error;
    }
  }

  async createSmSssq(smSssq: SmSssq): Promise<SmSssq> {
    // 获取病人基本信息
    const patientInfo = await this.h11BrxxRepository.findOne({
      where: { zyid: smSssq.zyid || '' },
    });

    if (!patientInfo) {
      throw new Error('病人不存在，请重新输入!');
    }

    // 设置病人基本信息
    smSssq.zyh = patientInfo.zybh;

    // 验证必填字段
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

    // 验证日期
    if (smSssq.sqrq > smSssq.ssrq) {
      throw new Error('申请日期不能大于申请手术日期!');
    }

    smSssq.sqdh = await this.gyIdentityService.getMax('SM_SSSQ');
    // 设置手术室信息
    smSssq.txks = patientInfo.cyksid;
    const h12Yzxb = await this.createMedicalOrders(smSssq);
    smSssq.bzxx5 = h12Yzxb.mxxh?.toString();

    return await this.smSssqRepository.save(smSssq);
  }

  private async createMedicalOrders(smSssq: SmSssq): Promise<h12_yzxb> {
    const currentTime = new Date();

    // 获取最大序号
    const maxMxxh = await this.gyIdentityService.getMax('h12_yzxbn');
    const maxYzzh = await this.gyIdentityService.getMax('h12_yzzh');

    const mzff = await this.mzffRepository.findOne({ where: { mzid: smSssq.mzdm } });

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
      xmmc: `拟于${this.formatDateTime(smSssq.ssrq)}在${mzff?.mzffmc}下行${smSssq.ssnm}`,
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
      sjbz: 1,
      sfbz: 1,
      jsbz: 1,
      zxbz: 0,
      tzbz: 0,
      fybz: '0',
      lryid: smSssq.czgh,
      hdbz: 1,
      tpbz: 0,
      scdh: smSssq.sqdh,
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

    return await this.entityManager.save(h12_yzxb, h12Yzxb);
  }

  private formatDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}年${month}月${day}日 ${hours}时${minutes}分`;
  }

  async findAll(queryDto: QuerySmSssqDto): Promise<[SmSssq[], number]> {
    const { pageNo = 1, pageSize = 10, sortBy, sortOrder = 'ASC', ...rest } = queryDto;
    const where = {};

    // Build dynamic where conditions
    Object.keys(rest).forEach((key) => {
      if (rest[key] !== undefined && rest[key] !== null) {
        where[key] = rest[key];
      }
    });

    const order = sortBy ? { [sortBy]: sortOrder } : undefined;

    return await this.smSssqRepository.findAndCount({
      where,
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
      order,
      relations: {
        h11BrxxEntity: true, // 病人信息
        jbbmicd10Entity: true, // 疾病编码
      },
    });
  }

  async findOne(sqdh: number): Promise<SmSssq> {
    return await this.smSssqRepository.findOne({
      where: { sqdh },
    });
  }

  async update(updateDto: UpdateSmSssqDto): Promise<SmSssq> {
    const { sqdh, ...updateData } = updateDto;
    await this.smSssqRepository.update({ sqdh }, updateData);
    return this.findOne(sqdh);
  }

  async remove(sqdh: number): Promise<void> {
    await this.smSssqRepository.delete({ sqdh });
  }
}
