import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { H11Fpzb } from './h11_fpzb.entity';
import {
  CreateH11FpzbDto,
  UpdateH11FpzbDto,
  H11FpzbQueryDto,
  H11FpzbCancelDto,
} from './h11_fpzb.dto';
import { H11ZypjPrimaryDto } from '../h11_zypj/h11_zypj.dto';
import { H11ZypjService } from '../h11_zypj/h11_zypj.service';
import { CreateH11FpxbDto } from '../h11_fpxb/h11_fpxb.dto';
import { H11Fpxb } from '../h11_fpxb/h11_fpxb.entity';
import { H11JszbService } from '../h11_jszb/h11_jszb.service';
import { H11JsxbService } from '../h11_jsxb/h11_jsxb.service';
import { ParamService } from '../h12_xmzd/service/param.service';
import { h11_lshService } from '../h11_lsh/h11_lsh.service';
import { chsService } from '../chs/chs.service';
import { CustomException } from '@/common/exceptions/custom.exception';
import { ERR } from '@/common/exceptions/error-code';
import { RedisService } from '@/shared/redis.service';
import { H11Jszb } from '../h11_jszb/h11_jszb.entity';
import { logger } from '@/utils/typeorm.logger';

@Injectable()
export class H11FpzbService {
  constructor(
    @InjectRepository(H11Fpzb)
    private readonly h11FpzbRepository: Repository<H11Fpzb>,
    private readonly h11ZypjService: H11ZypjService,
    private readonly h11JszbService: H11JszbService,
    private readonly h11JsxbService: H11JsxbService,
    private readonly paramService: ParamService,
    private readonly h11_lshService: h11_lshService,
    private readonly chsService: chsService,
    private redisService: RedisService,
    private dataSource: DataSource,
  ) { }

  async create(createH11FpzbDto: CreateH11FpzbDto) {

    logger.info('create', createH11FpzbDto)

    const cacheKey = `h21_fpzbService_create_${createH11FpzbDto.zyid}`;

    const cachedData = await this.redisService.get(cacheKey);

    if (cachedData) {
      throw new CustomException(ERR.ERR_10000, '该患者正在收费中...');
    }
    await this.redisService.set(cacheKey, cacheKey, 60);

    // const queryRunner = this.dataSource.createQueryRunner();
    // await queryRunner.connect();
    // await queryRunner.startTransaction();
    return await this.dataSource.transaction(async (manager) => {
      try {
        const { jsdh } = await this.h11JszbService.createByManager({
          ...createH11FpzbDto
        }, manager)
        createH11FpzbDto.jsdh = jsdh
        // 查询结算主表
        const h11JszbRepo = manager.getRepository(H11Jszb)
        const h11Jszb = await h11JszbRepo.findOne({ where: { jsdh: createH11FpzbDto.jsdh } });
        // const h11Jszb = await this.h11JszbService.findOne(createH11FpzbDto.jsdh);
        if (!h11Jszb) {
          throw new BadRequestException('结算主表查询失败');
        }

        const h11ZypjPrimaryDto: H11ZypjPrimaryDto = { pjlxid: 'FPHM', usid: h11Jszb.jsyid, fyid: '1' };
        const fphm = (await this.h11ZypjService.getCurrentNumber(h11ZypjPrimaryDto)).dqhm; //获取发票号码
        if (!fphm) {
          throw new BadRequestException('发票号码获取失败');
        } else {
          // 查一下这个发票号码有没有被使用过
          const fphmRet = await this.findOne(fphm);
          if (fphmRet) {
            throw new BadRequestException('获取到的发票号码已使用,请重试!');
          }
        }
        const syje = h11Jszb.ssje - createH11FpzbDto?.gfje || 0
        // 生成发票主表
        const h11Fpzb: CreateH11FpzbDto = {
          jsdh: h11Jszb.jsdh,
          zybh: h11Jszb.zybh,
          zyid: h11Jszb.zyid,
          brxm: h11Jszb.brxm,
          xbid: h11Jszb.xbid,
          rysj: h11Jszb.rysj,
          zzsj: h11Jszb.zzsj,
          fpje: Number(syje.toFixed(2)),
          yjje: h11Jszb.yjje,
          qtje: 0,
          // syje: h11Jszb.syje,
          syje: Number((h11Jszb?.yjje || 0 - syje || 0).toFixed(2)),
          ksid: h11Jszb.ksid,
          ksmc: h11Jszb.ksmc,
          sfyid: h11Jszb.jsyid,
          sfyxm: h11Jszb.jsyxm,
          sfsj: new Date(),
          sjzt: 1,
          fyhj: h11Jszb.ssje,
          fphm: fphm,
          kshm: '',
        };

        // 生成发票细表
        const H11Jsxb = await this.h11JsxbService.findAllNotPage({ jsdh: createH11FpzbDto.jsdh }, manager);
        const createH11FpxbDto: CreateH11FpxbDto[] = [];
        if (H11Jsxb.pageData.length <= 0) {
          throw new BadRequestException('结算细表查询失败');
        }
        for (let i = 0; i < H11Jsxb.pageData.length; i++) {
          createH11FpxbDto[i] = {
            fphm: fphm,
            fpxmid: H11Jsxb.pageData[i].fylbid,
            fpxmmc: H11Jsxb.pageData[i].fylbmc,
            fpxmje: H11Jsxb.pageData[i].jsje,
            fpxmqtje: H11Jsxb.pageData[i].zfje,
          };
        }

        // 保存发票主表
        const mainEntity = await manager.save(H11Fpzb, h11Fpzb);
        // 保存发票细表
        await manager.save(H11Fpxb, createH11FpxbDto);

        // 更新JSZB
        await manager
          .createQueryBuilder()
          .update('h11_jszb')
          .set({ fpbz: 1, fphm: fphm, sfsj: () => 'CURRENT_TIMESTAMP' })
          .where('jsdh = :jsdh', { jsdh: h11Jszb.jsdh })
          .execute();

        // 更新票据号码
        await manager
          .createQueryBuilder()
          .update('h11_zypj')
          .set({ dqhm: () => 'dqhm + 1' })
          .where('pjlxid = :pjlxid', { pjlxid: h11ZypjPrimaryDto.pjlxid })
          .andWhere('usid = :usid', { usid: h11ZypjPrimaryDto.usid })
          .andWhere('fyid = :fyid', { fyid: h11ZypjPrimaryDto.fyid })
          .execute();
        if (createH11FpzbDto?.setlinfo?.setl_id) {
          await this.chsService.saveSettlement({
            setlinfo: createH11FpzbDto.setlinfo,
            setldetail: createH11FpzbDto.setldetail,
            invono: fphm,
            czry: createH11FpzbDto.sfyid,
            g10Dzzh: createH11FpzbDto.g10Dzzh,
            ybdjh: createH11FpzbDto.zyid
          }, manager)
        }
        // await queryRunner.commitTransaction();
        return mainEntity;
      } catch (error: any) {
        // await queryRunner.rollbackTransaction();
        console.error(error);
        throw new CustomException(ERR.ERR_10000, error.message ?? '住院结算失败');
      } finally {
        await this.redisService.del(cacheKey);
        // await queryRunner.release();
      }
    })
  }

  async findAll(queryDto: H11FpzbQueryDto): Promise<{ pageData: H11Fpzb[]; total: number }> {
    const { pageNo = 1, pageSize = 10, ...filters } = queryDto;
    const skip = (pageNo - 1) * pageSize;

    const queryBuilder = this.h11FpzbRepository.createQueryBuilder('fpzb')
      .leftJoin('fpzb.bsDzpjEntity', 'bsDzpjEntity', 'bsDzpjEntity.mzzy=2')
      .addSelect([
        'bsDzpjEntity.jlxh',
        'bsDzpjEntity.jym',
        'bsDzpjEntity.pjhm',
        'bsDzpjEntity.pjdm',
      ])
    // 添加过滤条件
    if (filters.value) {
      queryBuilder.andWhere(
        '(fpzb.fphm LIKE :value or fpzb.jsdh LIKE :value or fpzb.zybh LIKE :value or fpzb.brxm LIKE :value or fpzb.zyid LIKE :value)',
        { value: `%${filters.value}%` },
      );
    }
    if (filters.fphm) {
      queryBuilder.andWhere('fpzb.fphm LIKE :fphm', { fphm: filters.fphm });
    }
    if (filters.kshm) {
      queryBuilder.andWhere('fpzb.kshm LIKE :kshm', { kshm: filters.kshm });
    }
    if (filters.zybh) {
      queryBuilder.andWhere('fpzb.zybh LIKE :zybh', { zybh: filters.zybh });
    }
    if (filters.jsdh) {
      queryBuilder.andWhere('fpzb.jsdh LIKE :jsdh', { jsdh: filters.jsdh });
    }
    if (filters.zyid) {
      queryBuilder.andWhere('fpzb.zyid LIKE :zyid', { zyid: filters.zyid });
    }
    if (filters.brxm) {
      queryBuilder.andWhere('fpzb.brxm LIKE :brxm', { brxm: `%${filters.brxm}%` });
    }
    if (filters.ksid) {
      queryBuilder.andWhere('fpzb.ksid LIKE :ksid', { ksid: filters.ksid });
    }
    if (filters.ksmc) {
      queryBuilder.andWhere('fpzb.ksmc LIKE :ksmc', { ksmc: `%${filters.ksmc}%` });
    }
    if (filters.start) {
      queryBuilder.andWhere('fpzb.sfsj >= :start', { start: filters.start });
    }
    if (filters.end) {
      queryBuilder.andWhere('fpzb.sfsj <= :end', { end: filters.end });
    }

    queryBuilder.orderBy(`fpzb.sfsj`, 'DESC');

    const [pageData, total] = await queryBuilder.skip(skip).take(pageSize).getManyAndCount();

    return { pageData, total };
  }

  async findOne(fphm: string): Promise<H11Fpzb> {
    const found = await this.h11FpzbRepository.findOne({
      where: { fphm },
    });

    return found;
  }

  async cancel(dto: H11FpzbCancelDto) {
    const userId = dto.czrid;
    const userName = dto.czrxm;
    const fpzb = await this.findOne(dto.fphm);
    console.log(fpzb);
    if (!fpzb) {
      throw new BadRequestException(`发票 ${dto.fphm} 不存在`);
    }
    if (fpzb.sjzt == 0 && fpzb.sjzt != null) {
      throw new BadRequestException(`该发票已经作废1！`);
    }
    if (fpzb.zfyid && fpzb.zfyid != null) {
      throw new BadRequestException(`该发票已经作废2！`);
    }
    if (fpzb.sfyid != userId) {
      throw new BadRequestException(`该收费员是${fpzb.sfyid},请本人作废！`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1.修改h22_yhjl
      const updateYHJL = await queryRunner.query(
        `Update h22_yhjl
             Set sjzt = 0
             Where mzid = @0 And bslx = '2'`,
        [fpzb.zyid],
      );

      // 2.连续作废结算单
      const jsdhZF = (
        await this.h11_lshService.getSerialNumber('JSDH', '结算单号码', 10)
      ).toString(); //获取结算单号
      if (!jsdhZF) throw new BadRequestException('结算单号获取失败');
      if (jsdhZF === '-1') throw new BadRequestException('发票号码获取失败');
      await this.cancelJSZB(fpzb.jsdh, jsdhZF, userId, userName, fpzb.zyid, queryRunner);

      // 3.获取作废发票号码
      const fphmZFnum = (
        await this.h11ZypjService.getCurrentNumber({
          pjlxid: 'FPHM',
          usid: userId,
          fyid: '1',
        })
      ).dqhm; //获取发票号码
      const fphmZF = 'ZF' + fphmZFnum;
      if (!fphmZF) {
        throw new BadRequestException('发票号码获取失败');
      } else {
        const fphmRet = await this.findOne(fphmZF); // 查一下这个发票号码有没有被使用过
        if (fphmRet) {
          throw new BadRequestException('获取到的发票号码已使用,请重试!');
        }
      }

      // 5.修改原发票信息
      const updateFPZBOld = await queryRunner.query(
        `Update h11_fpzb
             Set zfyid = @0, zfyxm = @1, zfsj = @2
             Where fphm = @3`,
        [userId, userName, new Date(), fpzb.fphm],
      );

      // 6.插入负数发票信息(主表)
      const insertFPZBFS = await queryRunner.query(
        `INSERT INTO h11_fpzb (fphm, zybh, jsdh, zyid, brxm, xbid, rysj, zzsj, fpje, yjje, syje, ksid, ksmc, sfyid, sfyxm, sfsj, sjzt, zfyid, zfyxm, zfsj, zfyy, qtje, fyksid, fyhj, dzfp)
         SELECT @0, zybh, @1, zyid, brxm, xbid, rysj, zzsj, fpje * -1, yjje * -1, syje * -1, ksid, ksmc, @2, @3, @4, sjzt, zfyid, zfyxm, zfsj, zfyy, qtje * -1, fyksid, fyhj * -1, @5
         FROM h11_fpzb 
         WHERE fphm = @6`,
        [fphmZF, jsdhZF, userId, userName, new Date(), fphmZF, fpzb.fphm],
      );

      // 7.插入负数发票信息(细表)
      const insertFPXBFS = await queryRunner.query(
        `INSERT INTO h11_fpxb (fphm, fpxmid, fpxmmc, fpxmje, fpxmqtje)
         SELECT @0, fpxmid, fpxmmc, fpxmje * -1, fpxmqtje * -1
         FROM h11_fpxb 
         WHERE fphm = @1`,
        [fphmZF, fpzb.fphm],
      );

      // 8.修改原结算主表信息
      const updateJSZBOld = await queryRunner.query(
        `Update h11_jszb Set fphm = @0 Where jsdh = @1`,
        [fphmZF, jsdhZF],
      );

      // 9.修改病人信息
      const mmjs = (await this.paramService.gfGetPara(11, 'mmjs', '0', '毛毛合并结算')).toString();
      if (mmjs == '0') {
        const updateBRXX = await queryRunner.query(
          `Update h11_brxx Set zyzt = 3, jssj = @0 Where zyid = @1`,
          ['', fpzb.zyid],
        );
      } else if (mmjs == '1') {
        const updateBRXX = await queryRunner.query(
          `Update h11_brxx Set zyzt = 3, jssj = @0 Where zyid = @1 or lsh = @2`,
          ['', fpzb.zyid, fpzb.zyid],
        );
      } else {
        const updateBRXX = await queryRunner.query(
          `Update h11_brxx Set zyzt = 3, jssj = @0 Where zyid = @1 or (lsh = @2 and brlxid = '0601')`,
          ['', fpzb.zyid, fpzb.zyid],
        );
      }

      // 10.生成明细负数
      const ylmbbz = (
        await this.paramService.gfGetParaNew(81, 'ylmbbz', '0', '启用养老管理系统(1启用，0未启用)')
      ).toString();
      if (ylmbbz == '1') {
      } else {
        const insertJSMX = await queryRunner.query(
          `INSERT INTO h13_yzzxcs_jsmx(zyid, jsdh,yzxh, yzlx, mxxh, zxrq, ksid, zkksid, fyksid, jfyl, jldw, sjyl, sjdw, syffid,syplid, xmdj, fylbid, zxcs, bzxcs, kyts, xmzl, xmid, xmmc, zflx, maxid,mzbh, sxys, ksys, kshs, kssxys,jssj, bz1, bz2, bz3, je1, je2, je3)
           SELECT zyid, @0,yzxh, yzlx, mxxh, zxrq, ksid, zkksid, fyksid, - 1 * jfyl, jldw, sjyl, sjdw, syffid,syplid, xmdj, fylbid, zxcs, bzxcs, kyts, xmzl, xmid, xmmc, zflx, maxid,mzbh, sxys, ksys, kshs, kssxys,jssj, bz1, bz2, bz3, je1, je2, je3
           FROM h13_yzzxcs_jsmx 
           WHERE zyid = @1
           AND jsdh = @2`,
          [jsdhZF, fpzb.zyid, fpzb.jsdh],
        );
      }
      // 11.修改发票号
      const updateZYPJ = await queryRunner.query(
        `Update h11_zypj Set dqhm = dqhm + 1 Where pjlxid = 'FPHM' and usid = @0 and fyid = '1'`,
        [userId],
      );
      //throw new BadRequestException('回滚测试!');
      await queryRunner.commitTransaction();
      return fphmZF
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
    return 0;
  }

  /**
   * 作废结算单
   * @param jsdh 结算单号
   * @param queryRunner 事务
   */
  async cancelJSZB(
    jsdh: string,
    jsdhZF: string,
    userId: string,
    userName: string,
    zyid: string,
    queryRunner: any,
  ) {
    // 1.修改医嘱信息
    const mmjs = (await this.paramService.gfGetPara(11, 'mmjs', '0', '毛毛合并结算')).toString();
    if (mmjs == '0') {
      const updateYZZX = await queryRunner.query(
        `Update h13_yzzxcs Set jsbz = 0, jsdh = '', xnhbz=0 Where zyid = @0 and jsdh = @1`,
        [zyid, jsdh],
      );
      const updateYZZB = await queryRunner.query(`Update h12_yzzb Set jsbz = 0 Where zyid = @0`, [
        zyid,
      ]);
    } else if (mmjs == '1') {
      const updateYZZX = await queryRunner.query(
        `Update h13_yzzxcs Set jsbz = 0, jsdh = '',xnhbz=0 Where zyid in (select zyid from h11_brxx where zyid=@0  or ( lsh = @1)) and jsdh = @2`,
        [zyid, zyid, jsdh],
      );
      const updateYZZB = await queryRunner.query(
        `Update h12_yzzb Set jsbz = 0 Where zyid in (select zyid from h11_brxx where zyid=@0  or ( lsh = @1))`,
        [zyid, zyid],
      );
    } else {
      const updateYZZX = await queryRunner.query(
        `Update h13_yzzxcs Set jsbz = 0, jsdh = '',xnhbz=0 Where zyid in (select zyid from h11_brxx where zyid=@0  or ( lsh = @1 and brlxid='0601' )) and jsdh = @2`,
        [zyid, zyid, jsdh],
      );
      const updateYZZB = await queryRunner.query(
        `Update h12_yzzb Set jsbz = 0 Where zyid in (select zyid from h11_brxx where zyid=@0  or ( lsh = @1 and brlxid='0601'))`,
        [zyid, zyid],
      );
    }

    // 2.将床位租用表(h13_cwzy)中属于该结算单的内容打上未结算标志
    const updateCWZY = await queryRunner.query(
      `Update h13_cwzy Set jsbz = 0, jsdh = '' Where jsdh = @0`,
      [jsdh],
    );

    // 3.将预交款(h11_yjk)中属于该结算单的收据打上未结算标志
    const selectYJK = await queryRunner.query(
      `SELECT isnull(Sum(rmbje),0) AS rmbje
       FROM h11_yjk  
       WHERE jsdh = @0
       And sjlx = 1 And sjzt = 1`,
      [jsdh],
    );
    const selectJSHZ = await queryRunner.query(
      `SELECT h11_jshz.zyid,h11_jshz.zybh,h11_jshz.brxm,   
            h11_jshz.yjhz as yjhz,   
            h11_jshz.jshz,   
            h11_jshz.syyj,   
            h11_jshz.qtje,   
            h11_jshz.qfbz  
       FROM h11_jshz  
       WHERE zyid = @0`,
      [zyid],
    );
    if (selectJSHZ.length > 0) {
      const updateJSHZ = await queryRunner.query(
        `Update h11_jshz Set yjhz = yjhz + @0 Where zyid = @1`,
        [selectYJK[0].rmbje, zyid],
      );
    } else {
      const insertJSHZ = await queryRunner.query(
        `Insert h11_jshz(zyid,zybh,brxm,yjhz) Values(@0,@1,@2,@3)`,
        [zyid, '', '', selectYJK[0].rmbje],
      );
    }
    const updateYJK = await queryRunner.query(
      `Update h13_cwzy Set jsbz = 0, jsdh = '' Where jsdh = @0`,
      [jsdh],
    );

    // 处方
    const updateCF = await queryRunner.query(
      `Update h12_yzcfxb Set jsbz = 0, jsdh = '' Where jsdh = @0`,
      [jsdh],
    );

    // 4.将手术细表(h15_ssxb)中属于该结算单的内容打上未结算标志
    const selectSSXB = await queryRunner.query(
      `SELECT isnull(Sum(xmdj*jfyl*zfbl),0) AS yszje
       FROM h15_ssxb  
       WHERE jsdh = @0
       And sfbz = 1`,
      [jsdh],
    );
    const updateSSZB = await queryRunner.query(
      `Update h15_sszb Set yszje = yszje + @0,jsbz = 0 Where zyid = @1`,
      [selectSSXB[0].yszje, zyid],
    );
    const updateSSXB = await queryRunner.query(
      `Update h15_ssxb Set jsbz = 0, jsdh = '',xnhbz=0 Where jsdh = @0`,
      [jsdh],
    );

    // 5.插入负数
    const insertJSZB = await queryRunner.query(
      `INSERT INTO h11_jszb (jsdh, zybh, brxm, xbid, rysj, zyid, jslx, jsje, zfje, gfje, jmje, qfje, ssje, jmlxid, fpzh, yjje, syje,zzsj, ksid, ksmc, jsyid, jssj, jsyxm, fpbz, czf, sjzt, sfsj, fphm)
           SELECT @0, zybh, brxm, xbid, rysj, zyid, jslx, jsje * -1, zfje * -1, gfje * -1, jmje * -1, qfje * -1, ssje * -1, jmlxid, @1, yjje * -1, syje * -1,zzsj, ksid, ksmc, @2, @3, @4, fpbz, czf, sjzt, @5, fphm
           FROM h11_jszb 
           WHERE jsdh = @6`,
      [jsdhZF, jsdh, userId, new Date(), userName, new Date(), jsdh],
    );

    const insertJSXB = await queryRunner.query(
      `INSERT INTO h11_jsxb (jsdh, fylbid, fylbmc, jsje, zfje, gfje, jmje, qfje, ssje)
         SELECT @0, fylbid, fylbmc, jsje* -1, zfje* -1, gfje* -1, jmje* -1, qfje* -1, ssje* -1
         FROM h11_jsxb 
         WHERE jsdh = @1`,
      [jsdhZF, jsdh],
    );

    const insertXNH = await queryRunner.query(
      `INSERT INTO H11_xnh (fphm, zyid, zyh, brxm, ylzh, fyhj, kbhj, sjhj, bsbl, ljfyhj, ljfykb, ljsjhj, lxdz, jgmc, sfje, dbje, yhje, yhkh, je1, je2, bz1, xnhj, je3,szbz, mzbc, qtje1, qtje2, qtje3, qtje4, bzxx,zfje,qt1,qt2,qt3,qt4,yfje,yfje1,yfje2,yfje3,yfje4)
           SELECT @0, zyid, zyh, brxm, ylzh, fyhj * -1, kbhj * -1, sjhj * -1, bsbl, ljfyhj * -1, ljfykb * -1, ljsjhj * -1, lxdz, jgmc, sfje * -1, dbje * -1, yhje * -1, yhkh, je1 * -1, je2 * -1, bz1, xnhj * -1, je3 * -1,szbz, mzbc  * -1, qtje1 * -1, qtje2 * -1, qtje3 * -1, qtje4 * -1, bzxx,zfje * -1,qt1 * -1,qt2 * -1,qt3 * -1,qt4 * -1,yfje * -1,yfje1 * -1,yfje2 * -1,yfje3 * -1,yfje4 * -1
           FROM H11_xnh 
           WHERE fphm = @1`,
      [jsdhZF, jsdh],
    );

    // 6.修改结算主表
    const updateJSZBOld = await queryRunner.query(`Update h11_jszb Set fpzh = @0 Where jsdh = @1`, [
      jsdhZF,
      jsdh,
    ]);

    return 0;
  }
}
