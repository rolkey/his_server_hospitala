import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, And } from 'typeorm';
import { H22Sfjl } from './h22_sfjl.entity';
import {
  CreateH22SfjlDto,
  UpdateH22SfjlDto,
  QueryH22SfjlDto,
  QueryCheckoutDateDto,
  CheckoutDateDto,
  CancelCheckoutDateDto,
  ResetCheckoutDateDto,
} from './h22_sfjl.dto';
import { ParamService } from '../h12_xmzd/service/param.service';
import { log } from 'console';
import * as dayjs from 'dayjs';
import { CustomException } from '@/common/exceptions/custom.exception';
import { ERR } from '@/common/exceptions/error-code';
import { GyIdentityService } from '../gy_identity/gy-identity.service';

@Injectable()
export class H22SfjlService {
  constructor(
    @InjectRepository(H22Sfjl)
    private readonly repo: Repository<H22Sfjl>,
    private readonly paramService: ParamService,
    private readonly gyIdentityService: GyIdentityService,
    private dataSource: DataSource,
  ) {}

  // async create(dto: CreateH22SfjlDto) {
  //   const entity = this.repo.create(dto as any);
  //   return this.repo.save(entity);
  // }

  async findAll(queryDto: QueryH22SfjlDto) {
    const { pageNo = 1, pageSize = 10, ...filters } = queryDto;
    const skip = (pageNo - 1) * pageSize;

    const queryBuilder = this.repo.createQueryBuilder('sfjl');

    // 添加过滤条件
    if (filters.sfyid) {
      queryBuilder.andWhere('sfjl.usid = :sfyid', { sfyid: filters.sfyid });
    }
    if (filters.startDate) {
      queryBuilder.andWhere('sfjl.rq >= :startDate', {
        startDate: filters.startDate,
      });
    }
    if (filters.endDate) {
      queryBuilder.andWhere('sfjl.rq <= :endDate', {
        endDate: filters.endDate,
      });
    }

    const [pageData, total] = await queryBuilder.skip(skip).take(pageSize).getManyAndCount();

    return { pageData, total };
  }

  async findOne(lsh: string) {
    return this.repo.findOne({ where: { lsh } });
  }

  // 查询结账起始日期
  async findCheckoutDate(dto: QueryCheckoutDateDto) {
    const userId = dto.sfyid;
    const bz = dto.bz;

    const sfjzbz = await this.paramService.gfGetParaNew(
      22,
      'sfjzbz',
      '0',
      '门诊住院收费结账标志(0合并,1分开)',
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let start_by = null;
    let start_by1 = null;
    try {
      if (sfjzbz == '0') {
        const h22_sfjl = await queryRunner.query(
          `SELECT Top 1 jsbz FROM h22_sfjl Where usid = @0 Order By rq Desc`,
          [userId],
        );
        const jsbz = h22_sfjl[0]?.jsbz || 0;
        if (jsbz == 0) {
          const h22Item = await queryRunner.query(
            `SELECT Min(sfrq) as sfrq FROM h22_fpzb Where sfrid = @0`,
            [userId],
          );
          const h11Item = await queryRunner.query(
            `SELECT Min(sfsj) as sfrq FROM h11_fpzb Where sfyid = @0`,
            [userId],
          );
          start_by = h22Item[0]?.sfrq;
          start_by1 = h11Item[0]?.sfrq;
          if (!start_by && !start_by1) {
            start_by = new Date();
            start_by.setHours(0, 0, 0, 0);
          } else if (!start_by && start_by1) {
            start_by = start_by1;
          } else if (start_by && start_by1) {
            if (start_by > start_by1) {
              start_by = start_by1;
            }
          }
          start_by.setHours(0, 0, 0, 0);
        } else if (jsbz == 1) {
          const startItem = await queryRunner.query(
            `SELECT Max(s_date) start FROM h22_sfjl  Where usid = @0`,
            [userId],
          );
          start_by = startItem[0]?.start;
        } else {
          const startItem = await queryRunner.query(
            `SELECT Max(e_date) start FROM h22_sfjl  Where usid = @0`,
            [userId],
          );
          start_by = startItem[0]?.start;
        }
      } else {
        if (bz == '1') {
          const jzbzItem = await queryRunner.query(
            `SELECT Top 1 jsbz FROM h22_sfjl  Where usid = @0 and isnull(jslx,0) in (0,1) Order By rq Desc`,
            [userId],
          );
          const jsbz = jzbzItem[0]?.jsbz || 0;
          if (!jsbz || jsbz == 0) {
            const startItem = await queryRunner.query(
              `SELECT Min(sfrq) as sfrq FROM h22_fpzb Where sfrid = @0`,
              [userId],
            );
            start_by = startItem[0]?.sfrq;
            start_by.setHours(0, 0, 0, 0);
          } else {
            const startItem = await queryRunner.query(
              `SELECT Max(e_date) as sfrq FROM h22_sfjl Where usid = @0 and isnull(jslx,0) in (0,1)`,
              [userId],
            );
            start_by = startItem[0]?.sfrq;
          }
        } else {
          const jzbzItem = await queryRunner.query(
            `SELECT Top 1 jsbz FROM h22_sfjl  Where usid = @0 and isnull(jslx,0) in (0,2) Order By rq Desc `,
            [userId],
          );
          const jsbz = jzbzItem[0]?.jsbz || 0;
          if (!jsbz || jsbz == 0) {
            const startItem = await queryRunner.query(
              `SELECT Min(sfsj) sfsj FROM h11_fpzb Where sfyid = @0`,
              [userId],
            );
            start_by1 = startItem[0]?.sfsj;
            start_by1.setHours(0, 0, 0, 0);
            start_by = start_by1;
            const start1Item = await queryRunner.query(
              `select min(sfsj) sfsj from h11_yjk where sfyid=@0`,
              [userId],
            );
            start_by1 = startItem[0]?.sfsj;
            if (!start_by || start_by > start_by1) {
              start_by = start_by1;
            }
          } else {
            const startItem = await queryRunner.query(
              `SELECT Max(e_date) as sfsj FROM h22_sfjl  Where usid = @0 and isnull(jslx,0) in (0,2)`,
              [userId],
            );
            start_by = startItem[0]?.sfsj;
          }
        }
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return { startDate: dayjs(start_by).format('YYYY-MM-DD HH:mm:ss') };
  }

  // 结账
  async checkout(dto: CheckoutDateDto) {
    const lsh = dto.lsh;
    const userId = dto.sfyid;
    const userName = dto.sfymc;
    const tjrq = dto.tjrq;
    const startDate = dto.startDate;
    const endDate = dto.endDate;
    const sfjzbz = await this.paramService.gfGetParaNew(
      22,
      'sfjzbz',
      '0',
      '门诊住院收费结账标志(0合并,1分开)',
    );
    let jslx = 0;
    if (sfjzbz == '0') {
      jslx = 0;
    } else if (sfjzbz == '1' || dto.bz == '1') {
      jslx = 1;
    } else {
      jslx = 2;
    }

    //return { result: 0, msg: '结账成功!', ...dto };

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1.门诊医保对账核对
      await this.outpatientCheck(userId, startDate, endDate, queryRunner);

      // 2.生成住院结账数据
      const zyFKFSItem = await this.createHospitaCheckout(userId, startDate, endDate, queryRunner);

      // 3.生成门诊结账数据
      const mzFKFSItem = await this.createOutpatientCheckout(
        userId,
        startDate,
        endDate,
        queryRunner,
      );

      // 4.保存结账记录
      const sfjlEntity: H22Sfjl = {
        lsh: lsh,
        usid: userId,
        unam: userName,
        jsbz: 2,
        shbz: 0,
        rq: new Date(tjrq),
        s_date: new Date(startDate),
        e_date: new Date(endDate),
        jslx: jslx,
        // 门诊金额
        mzje: 0,
        mzybje: 0,
        mzgfje: 0,
        mzjzje: 0,
        mzxnhje: 0,
        mzpos: 0,
        // 住院金额
        zyje: 0,
        zybjk: 0,
        zytk: 0,
        zyyjk: 0,
        zyyjkpos: 0,
        zyjsk: 0,
        zyxnhje: 0,
        zyybje: 0,
        zyjspos: 0,
        qtje1: 0,
        qtje2: 0,
        jshj:
          mzFKFSItem.mzjzItem.mzje +
          zyFKFSItem.zyjzItem.sfyje -
          zyFKFSItem.zyjzItem.tkje +
          zyFKFSItem.zyjzItem.bkje -
          mzFKFSItem.mzjzItem.mzposje -
          zyFKFSItem.zyjzItem.zyposje,
        qtje: 0,
        // 其他
        xjje: 0,
        yhje: 0,
        wxje: 0,
        jmje: 0,
        kje: 0,
        bsje: 0,
      };
      if (jslx == 0) {
        //合并
        sfjlEntity.mzje = mzFKFSItem.mzjzItem.mzje || 0;
        sfjlEntity.zyje = zyFKFSItem.zyjzItem.zyje || 0;
        sfjlEntity.xjje = mzFKFSItem.fkfsItem.xj + zyFKFSItem.fkfsItem.fyhj;
        sfjlEntity.yhje = mzFKFSItem.fkfsItem.Pos + zyFKFSItem.fkfsItem.yhje;
        sfjlEntity.wxje =
          mzFKFSItem.fkfsItem.wx +
          mzFKFSItem.fkfsItem.zfb +
          zyFKFSItem.fkfsItem.wxje +
          zyFKFSItem.fkfsItem.zfbje;
        sfjlEntity.jmje = mzFKFSItem.fkfsItem.jm + zyFKFSItem.fkfsItem.qtje;
        sfjlEntity.kje = mzFKFSItem.fkfsItem.hyk;
        sfjlEntity.bsje = mzFKFSItem.fkfsItem.bshj1 + zyFKFSItem.fkfsItem.hjbc;
      } else if (jslx == 1) {
        // 门诊
        sfjlEntity.mzje = mzFKFSItem.mzjzItem.mzje || 0;
        sfjlEntity.xjje = mzFKFSItem.fkfsItem.xj;
        sfjlEntity.yhje = mzFKFSItem.fkfsItem.Pos;
        sfjlEntity.wxje = mzFKFSItem.fkfsItem.wx;
        sfjlEntity.jmje = mzFKFSItem.fkfsItem.jm;
        sfjlEntity.kje = mzFKFSItem.fkfsItem.hyk;
        sfjlEntity.bsje = mzFKFSItem.fkfsItem.bshj1;
      } else if (jslx == 2) {
        // 住院
        sfjlEntity.zyje = zyFKFSItem.zyjzItem.zyje || 0;
        sfjlEntity.xjje = zyFKFSItem.fkfsItem.fyhj;
        sfjlEntity.yhje = zyFKFSItem.fkfsItem.yhje;
        sfjlEntity.wxje = zyFKFSItem.fkfsItem.wxje + zyFKFSItem.fkfsItem.zfbje;
        sfjlEntity.jmje = zyFKFSItem.fkfsItem.qtje;
        sfjlEntity.kje = 0;
        sfjlEntity.bsje = zyFKFSItem.fkfsItem.hjbc;
      }
      const h22sfjl = queryRunner.manager.create(H22Sfjl, {
        ...sfjlEntity,
      });
      await queryRunner.manager.save(h22sfjl);

      // 5.写结账标志
      if (jslx == 0 || jslx == 1) {
        const updateMZItem = await queryRunner.query(
          `Update h22_fpzb Set jkdh=@0 , jzrq = @1,jzbz = 1  Where
                  h22_fpzb.sfrid Like @2 And
                  h22_fpzb.sfrq >= @3  And
                  h22_fpzb.sfrq <= @4`,
          [lsh, endDate, userId, startDate, endDate],
        );
      }

      if (jslx == 0 || jslx == 2) {
        const updateZYItem = await queryRunner.query(
          `Update h11_fpzb Set jkdh=@0 , jzrq = @1,jzbz = 1  
           Where sfsj >= @2 
           And sfsj <= @3
	         And sfyid Like @4 `,
          [lsh, endDate, startDate, endDate, userId],
        );
      }

      const updateYJKItem = await queryRunner.query(
        `Update h11_yjk Set jkdh=@0 , jzrq = @1,jzbz = 1  
         Where sfsj >= @2
         And sfsj <= @3 
         And sfyid Like @4`,
        [lsh, endDate, startDate, endDate, userId],
      );

      // throw new Error('测试事务回滚');
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return { result: 0, msg: '结账成功!', ...dto };
  }

  // 门诊医保对账核对
  async outpatientCheck(userId: string, startDate: string, endDate: string, queryRunner: any) {
    const ybdzItem = await queryRunner.query(
      `select cast('医保多收费少(未打发票)' as varchar(60)) as lx,
            a.lsh,b.brxm,b.jssj,b.czry,
            SUM(isnull(a.medfee_sumamt,0)) as ybfyhj, /*费用合计*/
            SUM(isnull(a.hifp_pay,0) + isnull(a.hifmi_pay,0) + isnull(a.hifob_pay,0) +isnull(a.oth_pay,0)+ isnull(a.maf_pay,0) + isnull(a.acct_pay,0)+isnull(a.acct_mulaid_pay,0)) bchj, /*补助合计*/
            SUM(isnull(a.fund_pay_sumamt,0)) as ybbchj,/*基金支付总额*/
            SUM(isnull(a.hifp_pay,0)) as ybtjhj, /*统筹*/ 
            SUM(isnull(a.hifmi_pay,0) + isnull(a.hifob_pay,0)) as ybdbhj,  /*hifmi_pay 居民大病，hifob_pay 职工大额*/
            SUM(isnull(a.maf_pay,0)) as ybmzhj,  /*民政*/
            SUM(isnull(a.oth_pay,0)) as ybqthj,  /*其他*/ 
            SUM(isnull(a.acct_pay,0)) as ybzhhj,  /*个人账户*/
            SUM(isnull(a.acct_mulaid_pay,0)) as ybgjhj  /*个人共济*/
        from (select lsh,mdtrt_id,setl_id,setl_time,med_type ,medfee_sumamt, fund_pay_sumamt,hifmi_pay ,hifp_pay,hifob_pay , maf_pay , oth_pay , acct_pay,acct_mulaid_pay 
          from G60_jsxx
              union all
              select lsh,mdtrt_id,setl_id,setl_time,med_type,medfee_sumamt, fund_pay_sumamt,hifp_pay , hifmi_pay ,hifob_pay , maf_pay , oth_pay , acct_pay,acct_mulaid_pay 
                from G60_jsxx_zf) a ,g10_djxx b 
          where a.lsh=b.lsh and b.czry like @0 and  ( b.med_type like '1%' or  b.med_type like '5%') and a.setl_time>=@1 and a.setl_time<@2
                and b.jzlx=1 and a.lsh not in
                  (select h22_fpzb.mzid from h22_fpzb ,h22_jsxx where 
                          h22_fpzb.mzid=h22_jsxx.mzid and h22_fpzb.fpid=h22_jsxx.fpid and
                          h22_fpzb.sfrq>=@3 and h22_fpzb.sfrq<=@4 and h22_fpzb.sfrid  like @5 and h22_fpzb.zfbz=0)
        group  by a.lsh,b.brxm,b.jssj,b.czry having abs(SUM(isnull(a.hifp_pay,0) + isnull(a.hifmi_pay,0)
                  + isnull(a.hifob_pay,0) +isnull(a.oth_pay,0)+ isnull(a.maf_pay,0) + isnull(a.acct_pay,0)+isnull(a.acct_mulaid_pay,0)))>0
        union all
        select cast('收费多医保少(医保已取消或跨月作废发票)' as varchar(60)) as lx,
              h22_fpzb.mzid,h22_fpzb.brxm,null,null,
              sum(je),/*费用合计*/
              SUM(case when h22_jsxx.fkfsid IN('6','7','27','29','24','25','18','37','23','38') then h22_jsxx.je else 0 end ),/*补助合计*/
              SUM(case when h22_jsxx.fkfsid IN('6','7','27','29','24','25','18','37') then h22_jsxx.je else 0 end ),/*基金支付总额*/
              SUM(case when h22_jsxx.fkfsid IN('6','7') then h22_jsxx.je else 0 end ),/*统筹*/ 
              SUM(case when h22_jsxx.fkfsid IN('24','25') then h22_jsxx.je else 0 end ),/*hifmi_pay 居民大病，hifob_pay 职工大额*/
              SUM(case when h22_jsxx.fkfsid IN('18') then h22_jsxx.je else 0 end ),/*民政*/
              SUM(case when h22_jsxx.fkfsid IN('37') then h22_jsxx.je else 0 end ),/*其他*/
              SUM(case when h22_jsxx.fkfsid IN('23') then h22_jsxx.je else 0 end ),/*个人账户*/
              SUM(case when h22_jsxx.fkfsid IN('38') then h22_jsxx.je else 0 end )/*个人共济*/
        from h22_fpzb ,h22_jsxx where 
              h22_fpzb.mzid=h22_jsxx.mzid and h22_fpzb.fpid=h22_jsxx.fpid
              and h22_fpzb.sfrq>=@6 and h22_fpzb.sfrq<=@7 and h22_fpzb.sfrid  like @8 and h22_fpzb.zfbz=0
              and ((h22_jsxx.fkfsid='38' and ABS(h22_jsxx.je)=0 ) or h22_jsxx.fkfsid <> '38')
              and h22_fpzb.mzid not in
              (select a.lsh
                from (select lsh,mdtrt_id,setl_id,setl_time,med_type ,medfee_sumamt, fund_pay_sumamt,hifmi_pay ,hifp_pay,hifob_pay , maf_pay , oth_pay , acct_pay,acct_mulaid_pay 
                          from G60_jsxx
                        union all
                      select lsh,mdtrt_id,setl_id,setl_time,med_type,medfee_sumamt, fund_pay_sumamt,hifp_pay , hifmi_pay ,hifob_pay , maf_pay , oth_pay , acct_pay,acct_mulaid_pay 
                        from G60_jsxx_zf
                      union all
                      select lsh,mdtrt_id,setl_id,jssj,med_type ,medfee_sumamt, fund_pay_sumamt,hifmi_pay ,hifp_pay,hifob_pay , maf_pay , oth_pay , acct_pay,acct_mulaid_pay 
                            from G10_djxx  /* where dzbz='1' */
                  ) a ,g10_djxx b 
                    where a.lsh=b.lsh and b.jzlx=1 and b.czry like @9 and ( b.med_type like '1%' or  b.med_type like '5%') and a.setl_time>=@10 and a.setl_time<@11   
                    group by a.lsh 
                  having abs(sum(isnull(a.hifp_pay,0) + isnull(a.hifmi_pay,0)
                    + isnull(a.hifob_pay,0) +isnull(a.oth_pay,0)+ isnull(a.maf_pay,0) + isnull(a.acct_pay,0)+isnull(b.acct_mulaid_pay,0)))>0)
      
              and  h22_jsxx.fkfsid  IN ('6','7','27','29','24','25','18','37','23','38')
              group by h22_fpzb.mzid,h22_fpzb.brxm  having  abs(sum(h22_jsxx.je))>0`,
      [
        userId, //@0
        startDate, //@1
        endDate, //@2
        startDate, //@3
        endDate, //@4
        userId, //@5
        startDate, //@6
        endDate, //@7
        userId, //@8
        userId, //@9
        startDate, //@10
        endDate, //@11
      ],
    );
    if (ybdzItem.length > 0) {
      throw new CustomException(ERR.ERR_10000, '门诊医保对账存在不平，请检查核对！');
    }
    return 0;
  }

  // 生成住院结账数据
  async createHospitaCheckout(
    userId: string,
    startDate: string,
    endDate: string,
    queryRunner: any,
  ) {
    const fkfsItem = await queryRunner.query(
      `select sum(isnull(h11_xnh.fyhj,0)) as fyhj,
              sum(Case  when g10_djxx.insutype='390' and g10_djxx.clr_type in ('21','99971')  Then isnull(h11_xnh.sjhj,0) else 0 end ) as xnhje, /*城乡居民*/
              sum(isnull(h11_xnh.kbhj,0) ) as zsje, /*筛查*/
              sum(Case  when g10_djxx.insutype='390' and g10_djxx.clr_type in ('21','99971')  Then isnull(h11_xnh.ljfykb,0) else 0 end ) as ybje,/*职工医保*/
              sum(Case  when g10_djxx.insutype='390' and g10_djxx.clr_type in ('21','99971')  Then isnull(h11_xnh.ljfyhj,0) else 0 end) as ybkje,/*帐户支付*/
              sum(Case  when g10_djxx.insutype='390' and g10_djxx.clr_type in ('21','99971')  Then isnull(h11_xnh.dbje,0) else 0 end) as dbje,/*大病保险*/
              sum(Case  when g10_djxx.insutype='390' and g10_djxx.clr_type in ('21','99971')    Then isnull(h11_xnh.je2,0) else 0 end) as gwje,/*公 务 员*/
              sum(isnull(h11_xnh.yhje,0)) as yhje,/*银行支付*/
              sum(Case  when g10_djxx.insutype='390' and g10_djxx.clr_type in ('21','99971')    Then isnull(h11_xnh.mzbc,0) else 0 end) as mzbc,/*二次报销*/
              sum(Case  when g10_djxx.insutype='390' and g10_djxx.clr_type in ('21','99971')    Then isnull(h11_xnh.qtje1,0) else 0 end) as ecbc,/*医疗救助*/
              sum(Case  when g10_djxx.insutype='390' and g10_djxx.clr_type in ('21','99971')    Then isnull(h11_xnh.qtje2,0) else 0 end) as yyjm,/*医院减免*/
              sum(Case  when g10_djxx.insutype='390' and g10_djxx.clr_type in ('21','99971')    Then isnull(h11_xnh.qtje3,0) else 0 end) as fptd,/*兜底保障*/
              sum(Case  when g10_djxx.insutype='390' and g10_djxx.clr_type in ('21','99971')    Then isnull(h11_xnh.zfje,0) else 0 end) as xjje,/*医保自付*/
              sum(isnull(h11_xnh.qt2,0)) as hjbc,/*总补偿*/
              sum(Case  when g10_djxx.insutype='390' and g10_djxx.clr_type in ('21','99971')    Then isnull(h11_xnh.qt1,0) else 0 end) as qtbc,/*其他补助*/
              sum(Case  when g10_djxx.insutype='390' and g10_djxx.clr_type in ('21','99971')    Then isnull(h11_xnh.qt4,0) else 0 end) as deje,/*大额医疗*/
              sum(Case  when g10_djxx.insutype='390' and g10_djxx.clr_type in ('21','99971')    Then isnull(h11_xnh.ljsjhj,0) else 0 end) as ljsjhj,/*帐户支付*/
              sum(isnull(h11_xnh.je1,0)) as wxje,/*微信支付*/
              sum(isnull(h11_xnh.je3,0)) as zfbje,/*支 付 宝*/
              sum(isnull(h11_xnh.qtje4,0)) as qtje4,/*挂账*/
              sum(isnull(h11_xnh.sfje,0)) as sfje,/**/
              sum(isnull(h11_xnh.bsbl,0)) as bsbl,/**/
              sum(Case  when g10_djxx.insutype='390' and g10_djxx.clr_type in ('21','99971')    Then isnull(h11_xnh.yfje1,0) else 0 end) as gjje, /*代支 以下新加-----*/
              sum(Case  when g10_djxx.insutype='390'  and g10_djxx.clr_type not in ('21','99971')
              Then isnull(h11_xnh.sjhj,0)+isnull(h11_xnh.ljfykb,0)+isnull(h11_xnh.ljfyhj,0)+isnull(h11_xnh.dbje,0)+
                  isnull(h11_xnh.je2,0)+isnull(h11_xnh.mzbc,0)+isnull(h11_xnh.qtje1,0)+isnull(h11_xnh.qtje2,0)+isnull(h11_xnh.qtje3,0)+
                      isnull(h11_xnh.qt1,0)+isnull(h11_xnh.qt4,0)+isnull(h11_xnh.ljsjhj,0)+isnull(h11_xnh.yfje1,0)  Else 0 End)   as ydbc,/*居民异地*/

              sum(Case  when g10_djxx.insutype<>'390' and g10_djxx.clr_type in ('21','99970')   Then isnull(h11_xnh.sjhj,0) else 0 end) as xnhjegz, /*城乡居民*/
              /*sum(isnull(kbhj,0) ), 筛查*/
              sum(Case  when g10_djxx.insutype<>'390' and g10_djxx.clr_type in ('21','99970')   Then isnull(h11_xnh.ljfykb,0) else 0 end ) as ybjegz,/*职工医保*/
              sum(Case  when g10_djxx.insutype<>'390' and g10_djxx.clr_type in ('21','99970')   Then isnull(h11_xnh.ljfyhj,0) else 0 end) as ybkjegz,/*帐户支付*/
              sum(Case  when g10_djxx.insutype<>'390' and g10_djxx.clr_type in ('21','99970')   Then isnull(h11_xnh.dbje,0) else 0 end) as dbjegz,/*大病保险*/
              sum(Case  when g10_djxx.insutype<>'390' and g10_djxx.clr_type in ('21','99970')   Then isnull(h11_xnh.je2,0) else 0 end) as gwjegz,/*公 务 员*/
              /*sum(isnull(yhje,0)),银行支付*/
              sum(Case  when g10_djxx.insutype<>'390' and g10_djxx.clr_type in ('21','99970')   Then isnull(h11_xnh.mzbc,0) else 0 end) as mzbcgz,/*二次报销*/
              sum(Case  when g10_djxx.insutype<>'390' and g10_djxx.clr_type in ('21','99970')   Then isnull(h11_xnh.qtje1,0) else 0 end) as ecbcgz,/*医疗救助*/
              sum(Case  when g10_djxx.insutype<>'390' and g10_djxx.clr_type in ('21','99970')   Then isnull(h11_xnh.qtje2,0) else 0 end) as yyjmgz,/*医院减免*/
              sum(Case  when g10_djxx.insutype<>'390' and g10_djxx.clr_type in ('21','99970')   Then isnull(h11_xnh.qtje3,0) else 0 end) as fptdgz,/*兜底保障*/
              sum(Case  when g10_djxx.insutype<>'390' and g10_djxx.clr_type in ('21','99970')   Then isnull(h11_xnh.zfje,0) else 0 end) as xjjegz,/*医保自付*/
              sum(Case  when g10_djxx.insutype<>'390' /*and g10_djxx.clr_type in ('21','99970')*/   Then isnull(h11_xnh.qt2,0) else 0 end) as hjbcgz,  /*总补偿*/
              sum(Case  when g10_djxx.insutype<>'390' and g10_djxx.clr_type in ('21','99970')   Then isnull(h11_xnh.qt1,0) else 0 end) as qtbcgz,/*其他补助*/
              sum(Case  when g10_djxx.insutype<>'390' and g10_djxx.clr_type in ('21','99970')   Then isnull(h11_xnh.qt4,0) else 0 end) as dejegz,/*大额医疗*/
              sum(Case  when g10_djxx.insutype<>'390' and g10_djxx.clr_type in ('21','99970')   Then isnull(h11_xnh.ljsjhj,0) else 0 end) as ljsjhgz,/*帐户支付*/
              sum(Case  when g10_djxx.insutype<>'390' and g10_djxx.clr_type in ('21','99970')   Then isnull(h11_xnh.yfje1,0) else 0 end) as gjjegz,
              sum(Case  when g10_djxx.insutype<>'390'  and g10_djxx.clr_type not in ('21','99970')
              Then isnull(h11_xnh.sjhj,0)+isnull(h11_xnh.ljfykb,0)+isnull(h11_xnh.ljfyhj,0)+isnull(h11_xnh.dbje,0)+
                  isnull(h11_xnh.je2,0)+isnull(h11_xnh.mzbc,0)+isnull(h11_xnh.qtje1,0)+isnull(h11_xnh.qtje2,0)+isnull(h11_xnh.qtje3,0)+
                      isnull(h11_xnh.qt1,0)+isnull(h11_xnh.qt4,0)+isnull(h11_xnh.ljsjhj,0)+isnull(h11_xnh.yfje1,0)  Else 0 End)   as ydbczg, /*居民异地*/
              sum(isnull(h11_xnh.qt3,0)) as jxj,/*现金*/				 
              sum(isnull(h11_xnh.kbhj,0) + isnull(h11_xnh.qtje4,0) + isnull(h11_xnh.yfje,0)) as qtje,/*其他方式挂账，查*/		
              sum(isnull(h11_xnh.zfje,0) - isnull(h11_xnh.yfje1,0)) as zfje/*医保自费 - isnull(h11_xnh.ljfyhj,0) - isnull(h11_xnh.ljsjhj,0)*/
       from h11_xnh left join g10_djxx on h11_xnh.zyid=g10_djxx.lsh where  fphm in
              ( select jsdh from h11_fpzb Where
                CONVERT(VARCHAR, sfsj, 120) >= @0 and CONVERT(VARCHAR, sfsj, 120) <= @1 and  h11_fpzb.sjzt = 1 
                And sfyid like @2)  and  h11_xnh.bz1='1' `,
      [
        startDate, //@0
        endDate, //@1
        userId, //@2
      ],
    );

    // 住院金额
    const zyjeItem = await queryRunner.query(
      `SELECT isnull(round(Sum(a.fpxmje),4),0) as zyje
       FROM h11_fpzb b,h11_fpxb a
       WHERE a.fphm = b.fphm AND b.sjzt = 1
        AND b.sfyid like @0 
        AND b.sfsj >= @1  
        and b.sfsj <= @2`,
      [userId, startDate, endDate],
    );

    // 收费员金额
    const fpzf = await this.paramService.gfGetParaNew(11, 'zffp', '0', '冲红生成负数');
    let sfyjeItem = null;
    if (fpzf == '1') {
      sfyjeItem = await queryRunner.query(
        `Select isnull(sum(yjje),0),sum(case when  isnull(fkfsid,'')='5' then yjje else 0 end ) as sfyje
       FROM h11_yjk
       Where sfsj >= @0
       and sfsj<= @1 
       and sfyid like @2
       and ( yjje<0 or sjzt=1)`,
        [startDate, endDate, userId],
      );
    } else {
      sfyjeItem = await queryRunner.query(
        `Select isnull(sum(yjje),0),sum(case when  isnull(fkfsid,'')='5' then yjje else 0 end ) as sfyje
         From h11_yjk 
         Where sfsj >=@0  
         and sfsj<= @1 
         and sfyid like @2   
         and  ( yjje<0 or sjzt=1) `,
        [startDate, endDate, userId],
      );
    }

    // 退款金额
    const tkjeItem = await queryRunner.query(
      `Select isnull(sum(syje),0) as tkje 
       From h11_fpzb 
       Where sfsj >= @0 
       and sfsj <= @1
	     And sfyid like @2 
       and  sjzt = 1 and syje>0`,
      [startDate, endDate, userId],
    );

    // 补款金额
    const bkjeItem = await queryRunner.query(
      `Select - isnull(sum(syje),0) as bkje 
       From h11_fpzb 
       Where sfsj >= @0 
       and sfsj <= @1
	     And sfyid like @2 
       and  sjzt = 1 and syje<0`,
      [startDate, endDate, userId],
    );

    const zyposjeItem = await queryRunner.query(
      `Select isnull(sum(yhje),0) zyposje
       From h11_xnh Where fphm in
      ( select jsdh from h11_fpzb 
       Where sfsj >= @0 
       and sfsj <= @1 
       and  h11_fpzb.sjzt = 1 And upper(sfyid) like @2) and  h11_xnh.bz1='1'`,
      [startDate, endDate, userId],
    );

    const zyjzItem = {
      zyje: zyjeItem[0].zyje || 0,
      sfyje: sfyjeItem[0].sfyje || 0,
      tkje: tkjeItem[0].tkje || 0,
      bkje: bkjeItem[0].bkje || 0,
      zyposje: zyposjeItem[0].zyposje || 0,
    };

    const result = {
      fkfsItem: fkfsItem[0],
      zyjzItem: zyjzItem,
    };

    return result;
  }

  // 生成门诊结账数据
  async createOutpatientCheckout(
    userId: string,
    startDate: string,
    endDate: string,
    queryRunner: any,
  ) {
    const fkfsItem = await queryRunner.query(
      `Select sum(Case  when fkfsid = '1' Then je Else 0 End) as xj,
                sum(Case  when fkfsid = '3' Then je Else 0 End) as zz,
                sum(Case  when fkfsid = '5' Then je Else 0 End) as Pos,
                sum(Case  when (fkfsid = '6' Or fkfsid = '16') and g10_djxx.insutype='390' and g10_djxx.clr_type in ('11','99971') Then je Else 0 End) as ybbs,
                sum(Case  when fkfsid = '7' and g10_djxx.insutype='390'  and g10_djxx.clr_type in ('11','99971') Then je Else 0 End) as xhbs,
                sum(Case  when fkfsid = '8' Then je Else 0 End) as wx,
                sum(Case  when fkfsid = '9' Then je Else 0 End) as zfb,
                sum(Case  when fkfsid = '10' and g10_djxx.insutype='390' and g10_djxx.clr_type in ('11','99971') Then je Else 0 End) as jm,
                sum(Case  when fkfsid = '13' Then je Else 0 End) as hyk,
                sum(Case  when fkfsid = '17' Then je Else 0 End) as zk,
                sum(Case  when fkfsid = '12' Then je Else 0 End) as cs,
                sum(Case  when (fkfsid = '24' Or fkfsid = '25') and g10_djxx.insutype='390'  and g10_djxx.clr_type in ('11','99971') Then je Else 0 End) as db,
                sum(Case  when fkfsid = '18' and g10_djxx.insutype='390'  and g10_djxx.clr_type in ('11','99971') Then je Else 0 End) as ylbc,
                sum(Case  when fkfsid = '37' and g10_djxx.insutype='390'  and g10_djxx.clr_type in ('11','99971') Then je Else 0 End) as qtbc,
                sum(Case  when fkfsid = '23' and g10_djxx.insutype='390'  and g10_djxx.clr_type in ('11','99971') Then je Else 0 End) as zh,
                sum(Case  when fkfsid = '38' and g10_djxx.insutype='390'  /*and g10_djxx.clr_type in ('11','99971')*/ Then je Else 0 End) as gz,
                sum(Case  when fkfsid = '39' Then je Else 0 End) as hs,
                sum(Case  when fkfsid Not In ('1','5','6','16','7','8','9','10','13','17','12','24','25','18','23','39','38') 
                and g10_djxx.insutype='390'  and g10_djxx.clr_type in ('11','99971')
                Then je Else 0 End)   as qt,
                sum(Case  when fkfsid  In ('6','16','7','10','24','25','18','37','23') 
                and g10_djxx.insutype='390'  and g10_djxx.clr_type not in ('11','99971')
                Then je Else 0 End)   as ydbc,/*居民异地*/
                sum(Case  when (fkfsid = '6' Or fkfsid = '7' Or fkfsid = '16') and isnull(g10_djxx.insutype,'')<>'390'  and g10_djxx.clr_type in ('11','99970') Then je Else 0 End) as ybbs1,
                sum(Case  when ( fkfsid = '7') and isnull(g10_djxx.insutype,'')<>'390' and g10_djxx.clr_type in ('11','99970') Then je Else 0 End) as xhbs1,
                sum(Case  when fkfsid = '10' and isnull(g10_djxx.insutype,'')<>'390'   and g10_djxx.clr_type in ('11','99970') Then je Else 0 End) as jm1,
                sum(Case  when (fkfsid = '24' Or fkfsid = '25') and isnull(g10_djxx.insutype,'')<>'390' and g10_djxx.clr_type in ('11','99970')  Then je Else 0 End) as db1,
                sum(Case  when fkfsid = '18' and isnull(g10_djxx.insutype,'')<>'390' and g10_djxx.clr_type in ('11','99970') Then je Else 0 End) as ylbc1,
                sum(Case  when fkfsid = '37' and isnull(g10_djxx.insutype,'')<>'390' and g10_djxx.clr_type in ('11','99970') Then je Else 0 End) as qtbc1,
                sum(Case  when fkfsid = '23' and isnull(g10_djxx.insutype,'')<>'390' and g10_djxx.clr_type in ('11','99970') Then je Else 0 End) as zh1,
                sum(Case  when fkfsid = '38' and isnull(g10_djxx.insutype,'')<>'390' /*and g10_djxx.clr_type in ('11','99970')*/ Then je Else 0 End) as gz1,
                sum(Case  when ((fkfsid Not In ('1','5','6','16','7','8','9','10','13','17','12','24','25','18','23','38','39') 
                and isnull(g10_djxx.insutype,'')<>'390') /*or (fkfsid='38' and isnull(g10_djxx.insutype,'')='390' )*/ ) 
                and g10_djxx.clr_type in ('11','99970')
                Then je Else 0 End)  as qt1,
                sum(Case  when ((fkfsid  In ('6','16','7','10','24','25','18','37','23') 
                and g10_djxx.insutype<>'390') /*or (fkfsid in ('38') and g10_djxx.insutype='390')*/)  and g10_djxx.clr_type not in ('11','99970')
                Then je Else 0 End)   as ydbc1,/*职工异地*/
                sum(Case  when fkfsid IN('6','7','27','29','24','25','18','37','23','38') Then je Else 0 End)   as bshj1/*补助合计*/
                From h22_jsxx left join g10_djxx on h22_jsxx.mzid=g10_djxx.lsh
                Where EXISTS ( SELECT 1 FROM h22_fpzb 
                WHERE  h22_fpzb.mzid=h22_jsxx.mzid and h22_fpzb.fpid=h22_jsxx.fpid and
                h22_fpzb.sfrq >= @0 And h22_fpzb.sfrq <= @1 And h22_fpzb.zfbz = 0 
                And h22_fpzb.sfrid Like @2 And h22_fpzb.fplx Like @3 ) `,
      [
        startDate, //@0
        endDate, //@1
        userId, //@2
        '%', //@3
      ],
    );

    const mzjeItem = await queryRunner.query(
      `SELECT isnull(sum(h22_fpxb.sjje),0) as mzje
       FROM   h22_fpzb,h22_fpxb  
       WHERE  h22_fpzb.fpid=h22_fpxb.fpid
       and h22_fpzb.zfbz=0   and h22_fpzb.sfrid like @0
       and h22_fpzb.sfrq>=@1
       and h22_fpzb.sfrq<=@2 `,
      [userId, startDate, endDate],
    );

    const mzposjeItem = await queryRunner.query(
      `select sum(convert(float,csjje)) as mzposje 
       From h22_yhjl 
       where jssj>=@0 
       and jssj<=@1 
       and sjzt=1 
       and bslx='1' 
       and  usid like @2 `,
      [startDate, endDate, userId],
    );

    const mzjzItem = {
      mzje: mzjeItem[0].mzje || 0,
      mzposje: mzposjeItem[0].mzposje || 0,
    };

    const result = {
      fkfsItem: fkfsItem[0],
      mzjzItem: mzjzItem,
    };

    return result;
  }

  // async update(lsh: string, dto: UpdateH22SfjlDto) {
  //   await this.repo.update({ lsh }, dto as any);
  //   return this.findOne(lsh);
  // }

  // 取消结账
  async cancelCheckout(dto: CancelCheckoutDateDto) {
    const lsh = dto.lsh;
    const sfyid = dto.sfyid;

    // 使用事务确保数据一致性
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 查询要取消的结账记录
      const item = await queryRunner.manager.findOne(H22Sfjl, {
        where: { lsh, usid: sfyid },
      });

      if (!item) {
        throw new CustomException(ERR.ERR_10000, '结账记录不存在！');
      }

      if (item.shbz === 1) {
        throw new CustomException(ERR.ERR_10000, '已审核的结账记录不能取消结账！');
      }

      // 获取结账标志参数
      const sfjzbz = await this.paramService.gfGetParaNew(
        22,
        'sfjzbz',
        '0',
        '门诊住院收费结账标志(0合并,1分开)',
      );

      // 查询最大序号记录
      const queryBuilder = queryRunner.manager.createQueryBuilder(H22Sfjl, 'sfjl');
      queryBuilder.andWhere('sfjl.usid = :sfyid', { sfyid });

      if (sfjzbz == '0' || sfjzbz == '1') {
        queryBuilder.andWhere('COALESCE(sfjl.jslx, 0) IN (0, 1)');
      } else if (sfjzbz == '2') {
        queryBuilder.andWhere('COALESCE(sfjl.jslx, 0) IN (0, 2)');
      }

      queryBuilder.orderBy('sfjl.lsh', 'DESC');
      queryBuilder.take(1);
      const maxItem = await queryBuilder.getOne();

      if (!maxItem || maxItem.lsh.trim() != lsh) {
        throw new CustomException(ERR.ERR_10000, '该结账单不是最后一张，不能再取消！');
      }

      // 执行删除操作
      const result = await queryRunner.manager.delete(H22Sfjl, { lsh, usid: sfyid });

      // 提交事务
      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      // 回滚事务
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // 释放连接
      await queryRunner.release();
    }
  }

  // 重新结账
  async resetCheckout(dto: ResetCheckoutDateDto) {
    // 验证密码
    const { pwd } = dto;
    //let lsh = dto.lsh;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const querySAPwd = await queryRunner.query(
        `select isnull(pwrd,'') as pwrd from __usrcat where upper(usid)='SA'`,
        [],
      );
      if (querySAPwd[0]?.pwrd !== pwd) {
        throw new CustomException(ERR.ERR_10000, '密码输入错误！');
      }

      // 获取流水号
      // lsh = String(await this.gyIdentityService.getMax('h22_sfjl', 1));
      // lsh = new Date().getFullYear().toString().substring(2, 4) + lsh.padStart(7, '0');

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    return this.checkout({ ...dto });
  }
}
