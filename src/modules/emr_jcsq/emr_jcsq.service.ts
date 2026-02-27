import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Not, Repository } from 'typeorm';
import { emr_jcsq } from './emr_jcsq.entity';
import { Jcbw, Jcff, QueryDto, SaveDto } from './dto';
import { ERR } from '@/common/exceptions/error-code';
import { CustomException } from '@/common/exceptions/custom.exception';
import { emr_jcsqmx } from './emr_jcsqmx.entity';
import { GyIdentityService } from '../gy_identity/gy-identity.service';
import { h12_yzxb } from '../h12_yzzb/h12_yzxb.entity';
import { h12_yzxbService } from '../h12_yzzb/h12_yzxb.service';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';

@Injectable()
export class emr_jcsqService {
  constructor(
    @InjectRepository(emr_jcsq)
    private emr_jcsqRepo: Repository<emr_jcsq>,
    @InjectRepository(h12_yzxb)
    private h12YzxbRepo: Repository<h12_yzxb>,
    @InjectRepository(h11_brxx)
    private h11BrxxRepo: Repository<h11_brxx>,

    private dataSource: DataSource,
    private readonly gyIdentityService: GyIdentityService,

    @Inject(forwardRef(() => h12_yzxbService))
    private readonly h12YzxbService: h12_yzxbService,
  ) {}

  // 更新医嘱明细
  async updateAdvices(h12Yzxb: h12_yzxb, saveDto: SaveDto, xmid: string, manager: EntityManager) {
    // 删除同组明细，新增明细
    const yzxbs = [];
    for (const [index, item] of saveDto.zlxmList.entries()) {
      // 如果有项目ID限制，则只处理该项目数据
      if (xmid && xmid !== item.xmid) {
        continue;
      }
      if (item.xmid.startsWith('T')) {
        const advices = await this.h12YzxbService.getPackageItems({
          advice: h12Yzxb,
          mbid: item.xmid,
          recursionDepth: 0,
        });
        yzxbs.push(...advices);
      } else {
        const yzxb = new h12_yzxb();
        Object.assign(yzxb, h12Yzxb);
        // 处理检查明细
        yzxb.xmid = item.xmid;
        yzxb.xmmc = item.xmmc;
        yzxb.xmgg = item.gg;
        yzxb.gjybbm = item.gjybbm;
        yzxb.gjybmc = item.gjybmc;
        yzxb.fylbid = item.fylbid;
        // yzxb.xmdj = item.dj;
        yzxb.xmdj = (item as any).sfdj;
        yzxb.tpbz = 0;
        yzxb.tcbz = 1;
        yzxb.mxxh = await this.gyIdentityService.getMax('h12_yzxbn');

        yzxbs.push(yzxb);
      }
    }
    return [
      //   manager.delete(h12_yzxb, {
      //     zyid: h12Yzxb.zyid,
      //     yzzh: h12Yzxb.yzzh,
      //     mxxh: Not(h12Yzxb.mxxh),
      //   }),
      manager.save(h12_yzxb, yzxbs),
    ];
  }

  // 更新医嘱
  async updateAdvice(saveDto: SaveDto, jcsq: emr_jcsq, manager: EntityManager) {
    // 删除之后重新addAdvice
    const h12Yzxb = await this.h12YzxbRepo.findOne({
      where: { zyid: saveDto.mzid, scdh: saveDto.sqdh },
    });
    // 删除旧数据
    await manager.delete(h12_yzxb, {
      zyid: h12Yzxb.zyid,
      scdh: saveDto.sqdh,
    });
    await this.addAdvice(jcsq, saveDto, manager);
    // 把开嘱时间更新为旧的时间
    await manager.update(
      h12_yzxb,
      { zyid: saveDto.mzid, scdh: saveDto.sqdh },
      { yzrq: h12Yzxb.yzrq },
    );
  }

  async addAdvice(jcsq: emr_jcsq, saveDto: SaveDto, manager: EntityManager) {
    const currentTime = new Date().toISOString();
    const xmmc = this.createYzmc(saveDto);
    const h11_brxx = await this.h11BrxxRepo.findOne({
      where: { zyid: jcsq.mzid },
    });
    const tcs = saveDto.zlxmList
      .map((item) => (item.xmid.startsWith('T') ? item : null))
      .filter((item) => item);
    if (tcs.length > 0) {
      // 按组套来处理
      for (const tc of tcs) {
        await this.createAdvice(
          jcsq,
          h11_brxx,
          tc.xmid,
          tc.xmmc,
          tc.fylbid,
          currentTime,
          manager,
          saveDto,
        );
      }
    } else
      await this.createAdvice(jcsq, h11_brxx, '0000000', xmmc, '11', currentTime, manager, saveDto);
  }

  private async createAdvice(
    jcsq: emr_jcsq,
    h11_brxx: h11_brxx,
    xmid: string,
    xmmc: string,
    fylbid: string,
    currentTime: string,
    manager: EntityManager,
    saveDto: SaveDto,
  ) {
    const h12Yzxb = await this.h12YzxbService.createAdvice({
      zyid: jcsq.mzid,
      yzlx: 2,
      newGroup: true,
      newZxcs: true,
    });

    // 创建第一条医嘱
    Object.assign(h12Yzxb, {
      zybh: h11_brxx.zybh,
      xmid: xmid,
      xmmc: xmmc,
      jfyl: 1,
      sjyl: 1,
      syffid: '',
      syplid: 'QD',
      xmgg: '',
      xmdw: '',
      xmdj: 0,
      typbz: '',
      ksid: h11_brxx.cyksid ?? h11_brxx.ryksid,
      ksys: jcsq.sqys,
      kshs: null,
      fylbid: fylbid,
      sfje: 0,
      sjbz: 0,
      sfbz: 1,
      jsbz: 1,
      zxbz: 0,
      tzbz: 0,
      fybz: '0',
      lryid: jcsq.sqys,
      hdbz: 1,
      tpbz: 1,
      tcbz: 0,
      scdh: jcsq.sqdh,
      zflx: '0',
      xmzl: 1,
      tybz: 0,
      kyts: 1,
      clbz: 0,
      ypid: xmid,
      //   ksid: jcsq.sqks,
      ysbz: 1,
      srcs: 0,
      yzrq: currentTime,
      tjbz: 1,
      yzzt: 0,
      apbz: 0,
      zfbz: 0,
      ksnf: '07',
    });

    await Promise.all([
      manager.save(h12Yzxb),
      ...(await this.updateAdvices(h12Yzxb, saveDto, xmid, manager)),
    ]);
  }

  // 创建医嘱名称
  createYzmc(saveDto: SaveDto) {
    // 首先根据 xmmc 进行分组
    const grouped = saveDto.zlxmList.reduce(
      (acc, item) => {
        // 如果当前项目名称还没有被记录，则添加到集合中
        if (!acc.has(item.jcxmmc)) {
          acc.add(item.jcxmmc);
        }
        return acc;
      },
      new Set<string>(), // 使用 Set 来存储唯一的 xmmc
    );

    // 将 Set 转换为数组并用 '、' 连接
    return Array.from(grouped).join('、');
  }

  async save(saveDto: SaveDto) {
    const { jcbwList, jcffList, zlxmList, ...data } = saveDto;

    return await this.dataSource.transaction(async (manager) => {
      try {
        if (data.jzlx === '2') {
          //zlxmList就是申请单选择的所有的关联项目
          //住院逻辑
        }
        const existingJcsq = await manager.findOne(emr_jcsq, {
          where: { sqdh: data.sqdh },
        });
        if (existingJcsq && data.sqdh) {
          // 这里实现生成医嘱逻辑
          await this.updateAdvice(saveDto, existingJcsq, manager);

          return await this.updateJcsq(existingJcsq, data, jcbwList, jcffList, manager);
        } else {
          const jcsq = await this.createJcsq(data, jcbwList, jcffList, manager);

          // 这里实现生成医嘱逻辑
          await this.addAdvice(jcsq, saveDto, manager);
        }
      } catch (error) {
        console.error(error);
        throw new CustomException(ERR.ERR_10000, error.message ?? '保存申请单失败');
      }
    });
  }

  /**
   * 更新检查申请单
   */
  private async updateJcsq(
    existingJcsq: emr_jcsq,
    data: Partial<emr_jcsq>,
    jcbwList: any[],
    jcffList: any[],
    manager: EntityManager,
  ): Promise<emr_jcsq> {
    // 手动合并属性，避免类型问题
    Object.assign(existingJcsq, data);
    const updatedJcsq = existingJcsq;

    // 清空旧的明细记录
    await manager.delete(emr_jcsqmx, { sqdh: data.sqdh! });

    await this.saveJcsqDetails(data.sqdh, jcbwList, jcffList, manager);

    return await manager.save(updatedJcsq);
  }

  /**
   * 创建新的检查申请单
   */
  private async createJcsq(
    data: Partial<emr_jcsq>,
    jcbwList: Jcbw[],
    jcffList: Jcff[],
    manager: EntityManager,
  ): Promise<emr_jcsq> {
    const newId = await this.gyIdentityService.getMax('emr_jcsq');
    const newJcsq = manager.create(emr_jcsq, {
      ...data,
      sqdh: newId.toString(),
      jczt: '0',
    });

    await this.saveJcsqDetails(newId.toString(), jcbwList, jcffList, manager);

    return await manager.save(newJcsq);
  }

  /**
   * 保存检查申请单的明细记录
   */
  private async saveJcsqDetails(
    sqdh: string,
    jcbwList: Jcbw[],
    jcffList: Jcff[],
    manager: EntityManager,
  ): Promise<void> {
    // 保存检查部位
    if (jcbwList?.length) {
      const bwEntities = jcbwList.map((bw) =>
        manager.create(emr_jcsqmx, {
          sqdh,
          jcxmid: bw.jcxmid,
          bwid: bw.bwid,
        }),
      );
      await manager.save(bwEntities);
    }

    // 保存检查方法
    if (jcffList?.length) {
      const ffEntities = jcffList.map((ff) =>
        manager.create(emr_jcsqmx, {
          sqdh,
          jcxmid: ff.jcxmid,
          ffid: ff.ffid,
        }),
      );
      await manager.save(ffEntities);
    }
  }
  findOne(queryDto: QueryDto) {
    const queryBuilder = this.emr_jcsqRepo
      .createQueryBuilder('jcsq')

      // 👇 部位和方法从 emr_jcxmmx 取出来
      .leftJoinAndMapMany(
        'jcsq.jcsqmxList', // 映射成 jcxm.mxList 数组
        'emr_jcsqmx', // 中间表
        'mx',
        'mx.sqdh = jcsq.sqdh',
      )
      .leftJoinAndMapOne('mx.jcbw', 'emr_jcbw', 'bw', 'bw.bwid = mx.bwid')
      .leftJoinAndMapOne('mx.jcff', 'emr_jcff', 'ff', 'ff.ffid = mx.ffid')
      .leftJoinAndMapOne('mx.jcxm', 'emr_jcxm', 'xm', 'xm.jcxmid = mx.jcxmid')
      .leftJoinAndSelect('bw.zlxmList', 'zlxmList');
    queryBuilder.andWhere('jcsq.sqdh = :sqdh', { sqdh: queryDto.sqdh });

    return queryBuilder.getOne();
  }

  async getDeleteJcsqPromise(zyid: string, sqdhs: string[], manager: EntityManager) {
    if (!sqdhs.length) return;
    const jcsq = await manager.find(emr_jcsq, {
      where: { mzid: zyid, sqdh: In([...sqdhs]) },
      select: ['sqdh'],
    });
    if (!jcsq.length) return;

    return [
      manager.delete(emr_jcsqmx, { sqdh: In([...sqdhs]) }),
      manager.delete(emr_jcsq, { sqdh: In([...sqdhs]) }),
    ];
  }

  async deleteJcsq(zyid: string, sqdhs: string[], manager: EntityManager) {
    await Promise.all(await this.getDeleteJcsqPromise(zyid, sqdhs, manager));
  }
}
