import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, In } from 'typeorm';
import { H31_kcxx } from './h31_kcxx.entity';
import { H30_ypzd } from '../h30_ypzd/h30_ypzd.entity';
import { H00_xmzd } from '../h00_xmzd/h00_xmzd.entity';
import { CreateH31_kcxxDto } from './dto/create-h31_kcxx.dto';
import { UpdateH31_kcxxDto } from './dto/update-h31_kcxx.dto';
import { QueryKcjgDto, KcxxResponseDto } from './dto/h31-kcxx.dto';
import { ParamService } from '@/modules/h12_xmzd/service/param.service';
import { KcxxResultDto } from './dto/kcxx-result.dto';
import { KcjgYpidRequestDto, KcjgYpidResponseDto } from './dto/kcjg-ypid.dto';

@Injectable()
export class H31_kcxxService {
  constructor(
    @InjectRepository(H31_kcxx)
    private readonly h31_kcxxRepository: Repository<H31_kcxx>,
    @InjectRepository(H00_xmzd)
    private readonly h00_xmzdRepository: Repository<H00_xmzd>,
    @InjectRepository(H30_ypzd)
    private readonly h30_ypzdRepository: Repository<H30_ypzd>,
    private readonly paramService: ParamService,
  ) {}

  // 创建新记录
  async create(createDto: CreateH31_kcxxDto): Promise<H31_kcxx> {
    const newRecord = this.h31_kcxxRepository.create(createDto);
    return await this.h31_kcxxRepository.save(newRecord);
  }

  // 查询所有记录
  async findAll(): Promise<H31_kcxx[]> {
    return await this.h31_kcxxRepository.find();
  }

  // 根据主键查询单个记录
  async findOne(ksid: string, ypid: string): Promise<H31_kcxx | null> {
    return await this.h31_kcxxRepository.findOne({
      where: { ksid, ypid },
    });
  }

  // 更新记录
  async update(ksid: string, ypid: string, updateDto: UpdateH31_kcxxDto): Promise<H31_kcxx | null> {
    await this.h31_kcxxRepository.update({ ksid, ypid }, updateDto);
    return this.findOne(ksid, ypid);
  }

  // 删除记录
  async remove(ksid: string, ypid: string): Promise<void> {
    await this.h31_kcxxRepository.delete({ ksid, ypid });
  }

  // 根据条件查询
  async findByCondition(h31_kcxx: Partial<H31_kcxx>): Promise<H31_kcxx[]> {
    return await this.h31_kcxxRepository.find({
      where: {
        ksid: h31_kcxx.ksid,
        ypid: h31_kcxx.ypid,
      },
    });
  }

  // 批量插入
  async batchInsert(records: CreateH31_kcxxDto[]): Promise<H31_kcxx[]> {
    const entities = records.map((record) => this.h31_kcxxRepository.create(record));
    return await this.h31_kcxxRepository.save(entities);
  }

  // 获取库存数量大于指定值的记录
  async findByKcslGreaterThan(value: number): Promise<H31_kcxx[]> {
    return await this.h31_kcxxRepository
      .createQueryBuilder('h31_kcxx')
      .where('h31_kcxx.kcsl > :value', { value })
      .getMany();
  }

  // 获取过期药品（生产日期早于指定日期）
  async findExpired(beforeDate: Date): Promise<H31_kcxx[]> {
    return await this.h31_kcxxRepository
      .createQueryBuilder('h31_kcxx')
      .where('h31_kcxx.scrq < :beforeDate', { beforeDate })
      .getMany();
  }

  // 校验库存
  async validateInventory(ksid: string, ypid: string, quantity: number): Promise<boolean> {
    const record = await this.findOne(ksid, ypid);
    if (!record) return false;
    const { xsl, mzdfsl, dfsl, ssdfsl } = record;
    return xsl - (mzdfsl || 0) - (dfsl || 0) - (ssdfsl || 0) >= quantity;
  }

  private toResponseDto(entity: H31_kcxx): KcxxResponseDto {
    return {
      ksid: entity.ksid,
      ypid: entity.ypid,
      ypgg: entity.ypgg,
      cjid: entity.cjid,
      scph: entity.scph,
      lsjg: entity.lsjg,
      pfjg: entity.pfjg,
      gsid: entity.gsid,
      kcsl: entity.kcsl,
      sxrq: entity.sxrq,
      pzwh: entity.pzwh,
      scpc: entity.scpc,
      xsl: entity.xsl,
      zsm: entity.zsm,
    };
  }

  async ueReadKcjgXmid(
    asYpid: string,
    asYpmc: string,
    asYpgg: string,
    asKsid: string,
    adSl: number,
  ): Promise<KcxxResultDto> {
    const resultDto = new KcxxResultDto();

    try {
      // 第一步：查询库存信息
      const kcxxResult = await this.h31_kcxxRepository
        .createQueryBuilder('kcxx')
        .select([
          `kcxx.xsl - COALESCE(kcxx.mzdfsl, 0) - COALESCE(kcxx.dfsl, 0) -
                COALESCE(kcxx.ssdfsl, 0) as kcsl,
          COALESCE(kcxx.lsjg, 0) as lsjg,
          COALESCE(kcxx.pfjg, 0) as pfjg,
          kcxx.scph as scph,
          kcxx.gsid as gsid,
          kcxx.cjid as cjid,
          COALESCE(kcxx.ypid, '') as ypidn`,
        ])
        .where('kcxx.ksid IN (:asKsid)', { asKsid })
        .andWhere('kcxx.yxbz = 1')
        .andWhere(
          `kcxx.xsl - ABS(COALESCE(kcxx.mzdfsl, 0) + COALESCE(kcxx.dfsl, 0) +
                COALESCE(kcxx.ssdfsl, 0)) - :adSl >= 0`,
          { adSl },
        )
        .andWhere(
          'kcxx.ypid IN (SELECT ypid FROM h30_ypzd WHERE zwmc = :asYpmc AND ypgg = :asYpgg)',
          { asYpmc, asYpgg },
        )
        .orderBy('kcxx.scph')
        .limit(1)
        .getRawOne();

      if (!kcxxResult) {
        resultDto.success = false;
        resultDto.message = `未查到药品字典同名同规格库存数据，请核对: ${asYpmc}|规格${asYpgg}|编号${asYpid}`;
        return resultDto;
      }

      // 第二步：查询药品字典信息
      const ypzdInfo = await this.h30_ypzdRepository.findOne({
        where: { ypid: kcxxResult.ypidn },
        select: ['ysxs', 'jsl2'],
      });

      if (!ypzdInfo) {
        resultDto.success = false;
        resultDto.message = `未查到药品字典数据，请核对: ${kcxxResult.ypidn}${asYpmc}`;
        return resultDto;
      }

      const xs = ypzdInfo.ysxs || 1;
      const kcgl = ypzdInfo.jsl2 || 1;

      // 如果kcgl不为0，直接返回成功
      if (kcgl !== 0) {
        resultDto.success = true;
        resultDto.data = {
          lsjg: kcxxResult.lsjg,
          pfjg: kcxxResult.pfjg,
          scph: kcxxResult.scph,
          cjid: kcxxResult.cjid,
          gsid: kcxxResult.gsid,
          ypidn: kcxxResult.ypidn,
          kcsl: kcxxResult.kcsl,
          xs,
          kcgl,
        };
        return resultDto;
      }

      // 计算价格
      const lsjg = Number((kcxxResult.lsjg / xs).toFixed(4));
      const pfjg = Number((kcxxResult.pfjg / xs).toFixed(4));

      resultDto.success = true;
      resultDto.data = {
        lsjg,
        pfjg,
        scph: kcxxResult.scph,
        cjid: kcxxResult.cjid,
        gsid: kcxxResult.gsid,
        ypidn: kcxxResult.ypidn,
        kcsl: kcxxResult.kcsl,
        xs,
        kcgl,
      };

      return resultDto;
    } catch (error) {
      resultDto.success = false;
      resultDto.message = `查询药品库存信息时出错: ${error.message}`;
      return resultDto;
    }
  }

  async ueReadKsidMz(
    asXmid: string,
    asKsid: string,
    asKsid1: string,
    asKsid2: string,
    asKsid3: string,
    asKsid4: string,
  ): Promise<string> {
    // 查询药品信息
    const result = await this.h30_ypzdRepository
      .createQueryBuilder('ypzd')
      .select(['ypzd.syplid', 'ypzd.ypflid'])
      .where('ypzd.ypid = :asXmid', { asXmid })
      .getOne();

    if (!result) {
      throw new Error('该药品字典未找到药，请核对！');
    }

    const lsSyplid = result.syplid || '';
    const lsFylbid = result.ypflid || '';

    // 针剂为空就默认西药
    let zjksid = await this.paramService.gfGetPara(13, `zj${asKsid}`, '0603', `针剂${asKsid}`);
    if (!zjksid) {
      zjksid = asKsid;
    }

    let lsKsid = asKsid; // 默认值

    if (!lsSyplid) {
      lsKsid = asKsid;
    } else if (lsSyplid === '1' || lsSyplid === '3') {
      // 西药
      lsKsid = asKsid;
    } else if (lsSyplid === '2') {
      // 针剂
      lsKsid = zjksid;
    } else if (lsSyplid === '4') {
      lsKsid = asKsid3;
    } else if (lsSyplid === '5') {
      lsKsid = asKsid2;
    } else if (lsSyplid === '6') {
      lsKsid = asKsid4;
    }

    if (lsFylbid === '72') {
      // 疫苗
      lsKsid = asKsid4;
    }

    return lsKsid;
  }

  async queryKcjg(query: QueryKcjgDto) {
    const { lx, ypid, ypmc, xmzl, ksid1, ksid2, ksid3, ksid4, ksid5 } = query;
    console.error('query', query);

    if (Number(xmzl) === 1) {
      // 项目查询逻辑
      const xmzd = await this.h00_xmzdRepository.findOne({ where: { xmid: ypid } });
      if (!xmzd) {
        throw new Error('未查到项目字典数据');
      }

      return {
        lsjg: xmzd.sfdj, // TODO: 四舍五入
        pfjg: xmzd.pfjg,
        kcdw: xmzd.kcdw,
        sfdw: xmzd.jldw,
        ypgg: xmzd.ggxh,
        fyfs: xmzd.fyfs,
        ybfl: xmzd.zflx,
        zzbz: String(xmzd.sfbz),
        fylbid: xmzd.fylbid,
      };
    } else {
      // 药品查询逻辑
      const ypzd = await this.h30_ypzdRepository.findOne({ where: { ypid } });
      if (!ypzd) {
        throw new Error('未查到药品字典数据');
      }

      // TODO: ue_read_ksid_mz逻辑未明
      const ksids = [ksid1, ksid2, ksid3, ksid4, ksid5].filter(Boolean);
      const kcxx = await this.h31_kcxxRepository.findOne({
        // where: { ypid, ksid: In(ksids), yxbz: 1, kcsl: MoreThan(0) },
        where: { ypid, yxbz: 1 },
        order: { scph: 'ASC' },
      });

      if (!kcxx) {
        throw new Error('药品库存不足');
      }

      return {
        lsjg: Number(ypzd.yjjl) / ypzd.ysxs,
        pfjg: Number(ypzd.sjjl) / ypzd.ysxs,
        scph: kcxx.scph,
        cjid: kcxx.cjid,
        gsid: kcxx.gsid,
        kcdw: ypzd.yjjl,
        sfdw: ypzd.sjjl,
        ypgg: ypzd.ypgg,
        fyfs: ypzd.syplid,
        ybfl: ypzd.abcfl.toString(),
        zzbz: ypzd.zzbz,
        cfqj: ypzd.cfqj,
        zysx: ypzd.zysx,
        psbz: ypzd.jsl1.toString(),
        syffid: ypzd.syffid,
        zxks: kcxx.ksid,
        kcsl: kcxx.kcsl,
        success: true,
      };
    }
  }

  /**
   * ue_read_kcjg_ypid 函数复现
   * @param request
   * @returns
   */
  async ueReadKcjgYpid(request: KcjgYpidRequestDto): Promise<KcjgYpidResponseDto> {
    const response = new KcjgYpidResponseDto();
    const gl_djws = Number(await this.paramService.gfGetPara(13, 'yzyxsj', '4', '医嘱单价位数'));

    try {
      if (request.ypid === '0000000') {
        response.success = true;
        return response;
      }

      // 处理项目类型
      if (request.lx === 0) {
        const xmzl = await this.h00_xmzdRepository.findOne({
          where: { xmid: request.ypid },
          select: ['xmzl'],
        });
        if (xmzl) {
          request.xmzl = xmzl.xmzl;
        }
      }

      const ypidn = request.ypid;

      if (request.xmzl === 1) {
        // 处理项目
        const xmzd = await this.h00_xmzdRepository.findOne({
          //   where: { xmid: request.ypid, yxbz: 1 },
          where: { xmid: request.ypid },
          // TODO: yxbz是啥东东？
        });

        if (!xmzd) {
          response.success = false;
          response.message = `未查到项目字典数据，请核对 [${request.ypid}: ${request.ypmc}]`;
          return response;
        }

        // 处理价格
        let lsjg = this.roundNumber(xmzd.sfdj, gl_djws);
        let pfjg = this.roundNumber(xmzd.pfjg, gl_djws);

        if (lsjg > 0 && lsjg < 0.001) lsjg = 0.001;
        if (pfjg > 0 && pfjg < 0.001) pfjg = 0.001;

        response.success = true;
        response.data = {
          ksid: null,
          lsjg,
          pfjg,
          scph: xmzd.scph,
          cjid: '',
          gsid: '',
          kcdw: xmzd.kcdw,
          sfdw: xmzd.jldw,
          ypgg: xmzd.ggxh,
          fyfs: xmzd.fyfs,
          ybfl: xmzd.zflx,
          zzbz: '',
          cfqj: '',
          zysx: '',
          psbz: '',
          syffid: '',
          zxks: xmzd.tczfblid,
          fylbid: xmzd.fylbid,
          sfbz: xmzd.sfbz,
          sj1: 0,
          sj2: 0,
          bz1: xmzd.fybz,
          bz2: '',
          bz3: '',
          ypidn,
          kcsl: 1000,
          gjybbm: xmzd.gjybbm,
          gjybmc: xmzd.gjybmc,
        };
      } else {
        // 处理药品
        const ypzd = await this.h30_ypzdRepository.findOne({
          where: { ypid: request.ypid },
        });

        if (!ypzd) {
          response.success = false;
          response.message = `未查到药品字典数据，请核对:${request.ypid}${request.ypmc}`;
          return response;
        }

        const xs = ypzd.ysxs || 1;
        const kcgl = ypzd.jsl2 ?? 1;

        if (kcgl !== 0) {
          response.success = true;
          response.data = {
            ksid: null,
            lsjg: 0,
            pfjg: 0,
            scph: '',
            cjid: '',
            gsid: '',
            kcdw: ypzd.yjjl,
            sfdw: ypzd.sjjl,
            ypgg: ypzd.ypgg,
            fyfs: ypzd.syplid,
            ybfl: ypzd.abcfl?.toString().padStart(2, '0') || '00',
            zzbz: String(ypzd.zzbz),
            cfqj: ypzd.cfqj,
            zysx: ypzd.zysx,
            psbz: ypzd.jsl1?.toString() || '',
            syffid: ypzd.syffid,
            zxks: '',
            fylbid: ypzd.ypflid,
            sfbz: 1,
            sj1: 0,
            sj2: 0,
            bz1: '1',
            bz2: '',
            bz3: '',
            ypidn,
            kcsl: 0,
            xs,
            kcgl,
            gjybbm: ypzd.gjybbm,
            gjybmc: ypzd.gjybmc,
          };
          return response;
        }

        // 获取科室ID
        const lsKsid = await this.ueReadKsidMz(
          request.ypid,
          request.ksid1,
          request.ksid2,
          request.ksid3,
          request.ksid4,
          request.ksid5,
        );

        // 查询库存信息
        let kcxx = await this.h31_kcxxRepository
          .createQueryBuilder('kcxx')
          .select([
            'COALESCE(kcxx.kcsl, 0) as kcsl',
            'COALESCE(kcxx.lsjg, 0) as lsjg',
            'COALESCE(kcxx.pfjg, 0) as pfjg',
            'kcxx.sxrq as sxrq',
            'kcxx.scpc as scpc',
            'kcxx.scph as scph',
            'kcxx.pzwh as pzwh',
            'kcxx.gsid as gsid',
            'kcxx.cjid as cjid',
            'kcxx.ksid as zxks',
          ])
          .where('kcxx.ksid = :lsKsid', { lsKsid })
          .andWhere('kcxx.ypid = :ypid', { ypid: request.ypid })
          .andWhere('kcxx.yxbz = 1')
          .andWhere('kcxx.kcsl > 0')
          .andWhere(
            'kcxx.xsl - ABS(COALESCE(kcxx.mzdfsl, 0) + COALESCE(kcxx.dfsl, 0) + COALESCE(kcxx.ssdfsl, 0)) >= 1',
          )
          .orderBy('kcxx.scph')
          .limit(1)
          .getRawOne();

        if (!kcxx) {
          kcxx = await this.h31_kcxxRepository
            .createQueryBuilder('kcxx')
            .select([
              'COALESCE(kcxx.kcsl, 0) as kcsl',
              'COALESCE(kcxx.lsjg, 0) as lsjg',
              'COALESCE(kcxx.pfjg, 0) as pfjg',
              'kcxx.sxrq as sxrq',
              'kcxx.scpc as scpc',
              'kcxx.scph as scph',
              'kcxx.pzwh as pzwh',
              'kcxx.gsid as gsid',
              'kcxx.cjid as cjid',
              'kcxx.ksid as zxks',
            ])
            .where('kcxx.ksid = :lsKsid', { lsKsid })
            .andWhere('kcxx.ypid = :ypid', { ypid: request.ypid })
            .andWhere('kcxx.yxbz = 1')
            .andWhere('kcxx.sxrq > getdate()')
            .andWhere(
              'kcxx.xsl - ABS(COALESCE(kcxx.mzdfsl, 0) + COALESCE(kcxx.dfsl, 0) + COALESCE(kcxx.ssdfsl, 0)) >= 1',
            )
            .orderBy('kcxx.scph')
            .limit(1)
            .getRawOne();
        }

        // 处理医保分类
        let ybfl = ypzd.abcfl?.toString() || '0';
        if (ybfl !== '0' && ybfl.length === 1) {
          ybfl = '0' + ybfl;
        }

        // 计算总库存
        const totalKcsl = await this.h31_kcxxRepository
          .createQueryBuilder('kcxx')
          .select('SUM(kcxx.kcsl)', 'totalKcsl')
          .where('kcxx.ksid = :lsKsid', { lsKsid })
          .andWhere('kcxx.ypid = :ypid', { ypid: request.ypid })
          .andWhere('kcxx.yxbz = 1')
          .andWhere('kcxx.sxrq > getdate()')
          .getRawOne();

        const kcsl = totalKcsl?.totalKcsl || 0;

        // 处理价格
        let lsjg = this.roundNumber((kcxx?.lsjg || 0) / xs, gl_djws);
        let pfjg = this.roundNumber((kcxx?.pfjg || 0) / xs, gl_djws);

        if (lsjg > 0 && lsjg < 0.001) lsjg = 0.001;
        if (pfjg > 0 && pfjg < 0.001) pfjg = 0.001;

        response.success = true;
        response.data = {
          ksid: lsKsid,
          lsjg,
          pfjg,
          scph: kcxx?.scph || '',
          cjid: kcxx?.cjid || '',
          gsid: kcxx?.gsid || '',
          kcdw: ypzd.yjjl,
          sfdw: ypzd.sjjl,
          ypgg: ypzd.ypgg,
          fyfs: ypzd.syplid,
          ybfl: ybfl,
          zzbz: String(ypzd.zzbz),
          cfqj: ypzd.cfqj,
          zysx: ypzd.zysx,
          psbz: ypzd.jsl1?.toString() || '',
          syffid: ypzd.syffid,
          zxks: kcxx?.zxks || lsKsid,
          fylbid: ypzd.ypflid,
          sfbz: 1,
          sj1: 0,
          sj2: 0,
          bz1: '1',
          bz2: '',
          bz3: '',
          ypidn,
          kcsl,
          xs,
          kcgl,
          gjybbm: ypzd.gjybbm,
          gjybmc: ypzd.gjybmc,
        };

        // 库存不足处理
        if (kcsl <= 0) {
          // 调用ueReadKcjgXmid方法
          // 这里需要实现ueReadKcjgXmid的调用逻辑
          const { data } = await this.ueReadKcjgXmid(ypzd.ypid, ypzd.zwmc, ypzd.ypgg, lsKsid, 1);
          // 如果失败，设置错误信息

          if (data) {
            response.data.lsjg = data.lsjg;
            response.data.pfjg = data.pfjg;
            response.data.scph = data.scph;
            response.data.cjid = data.cjid;
            response.data.gsid = data.gsid;
            response.data.ypidn = data.ypidn;
            response.data.kcsl = data.kcsl;
            response.data.xs = data.xs;
            response.data.kcgl = data.kcgl;
          } else {
            response.message = `${ypzd.zwmc}${request.ypid}该药品：${ypzd.zwmc},发药科室：${lsKsid},库存：${kcsl}无库存，不允许使用该药品或材料，请手工录入附加!`;
          }
        } else if (xs * kcsl < 3) {
          response.message = `${ypzd.zwmc},${request.ypid}关联科室药品库存为:${this.roundNumber(
            kcsl * xs,
            2,
          )}${ypzd.yjjl},请与药剂科确认，是否足够使用!${lsKsid}`;
        }

        if (!response.data.zxks) {
          response.message = `${request.ypid}${ypzd.zwmc}该药未找到发药科室，请记下操作步聚与网管或工程师联系！`;
        }
      }

      return response;
    } catch (error) {
      response.success = false;
      response.message = `查询药品库存价格时出错: ${error.message}`;
      return response;
    }
  }

  private roundNumber(value: number, decimals: number): number {
    return Number(value?.toFixed(decimals));
  }
}
