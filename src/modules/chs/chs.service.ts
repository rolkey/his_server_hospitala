import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { G01Ryxx } from './G01Ryxx';
import { G01Cbxx } from './G01Cbxx';
import { G01Sfxx } from './G01Sfxx';
import { G50Zdxx } from './G50Zdxx';
import { G10Djxx } from './G10Djxx';
import { ChsPersonDetail, MsgDto, PreSettlement, Settlement } from './dto';
import { CustomException } from '@/common/exceptions/custom.exception';
import { ERR } from '@/common/exceptions/error-code';
import { G60Jsxx } from './G60Jsxx';
import { G60Fymx } from './G60Fymx';
import { G60Jsmx } from './G60Jsmx';
import { G60JsxxZf } from './G60JsxxZf';
// import { h23_cfmx } from '../h23_cfzb/h23_cfmx.entity';
import { G01Log } from './G01Log';
import * as crypto from 'crypto';
import dayjs = require('dayjs');
// import { logger } from '@/shared/typeorm.logger';
import { syspar_newService } from '../syspar_new/syspar_new.service';
// import { SnowflakeIdGenerator } from '@/utils/SnowflakeIdGenerator';
import { G10Dzzh } from './G10Dzzh';
import { G60Dzjs } from './G60Dzjs';
// import { h13_yzzxcs } from '../h12_yzzb/h13_yzzxcs.entity';
// import { H15Ssxb } from '../h15_ssxb/h15-ssxb.entity';

@Injectable()
export class chsService implements OnModuleInit {
  // 1. 定义一个私有 Map 用于存储参数
  private fixmedins_code = '';

  constructor(
    // @InjectRepository(G01Ryxx)
    // private g01RyxxRepo: Repository<G01Ryxx>,
    // @InjectRepository(G01Cbxx)
    // private g01CbxxRepo: Repository<G01Cbxx>,
    // @InjectRepository(G50Zdxx)
    // private g50ZdxxRepo: Repository<G50Zdxx>,
    // @InjectRepository(G10Djxx)
    // private g10DjxxRepo: Repository<G10Djxx>,
    // @InjectRepository(G60Jsxx)
    // private g60JsxxRepo: Repository<G60Jsxx>,
    // @InjectRepository(G01Log)
    // private g01LogRepo: Repository<G01Log>,
    // @InjectRepository(G01Sfxx)
    // private g01SfxxRepo: Repository<G01Sfxx>,
    @InjectRepository(G60Fymx)
    private g60FymxRepo: Repository<G60Fymx>,
    // @InjectRepository(G10Dzzh)
    // private g10DzzhRepo: Repository<G10Dzzh>,
    // @InjectRepository(G60Dzjs)
    // private g60DzjsRepo: Repository<G60Dzjs>, 

    private readonly syspar_newService: syspar_newService,
    private dataSource: DataSource,
  ) { }
  async onModuleInit() {
    try {
      const syspar_new = await this.syspar_newService.findNewOne('1', 'xyb_yydm');
      this.fixmedins_code = syspar_new?.pval || '';
    } catch (error) {
      // logger.error('医保参数初始化失败', error);
    }
  }

  async getFymxByLsh(lsh: string, lshxh: string) {
    return this.g60FymxRepo.find({ where: { lsh, lshxh } })
  }
  // async saveChsPersonDetail(chsPersonDetail: ChsPersonDetail) {
  //   await this.dataSource.transaction(async (manager) => {
  //     try {
  //       const {
  //         lsh,
  //         lshxh,
  //         baseinfo,
  //         insuplc_admdvs,
  //         insuinfo,
  //         cardSn,
  //         cardno,
  //         ectoken,
  //         idetinfo,
  //         insuorg,
  //         mdtrt_cert_no,
  //         mdtrt_cert_type,
  //       } = chsPersonDetail;

  //       const ryxxRepo = manager.getRepository(G01Ryxx);

  //       const cbxxRepo = manager.getRepository(G01Cbxx);

  //       const sfxxRepo = manager.getRepository(G01Sfxx);

  //       await manager.delete(G01Ryxx, { lsh, lshxh });

  //       await manager.delete(G01Cbxx, { lsh, lshxh });

  //       await manager.delete(G01Sfxx, { lsh, lshxh });

  //       await ryxxRepo.insert({
  //         lsh,
  //         lshxh,
  //         mdtrt_cert_no: mdtrt_cert_no,
  //         mdtrt_cert_type: mdtrt_cert_type,
  //         mdtrtcertno: mdtrt_cert_no,
  //         ectoken,
  //         insuorg,
  //         cardno,
  //         card_sn: cardSn,
  //         brdy: baseinfo.brdy,
  //         extend: baseinfo.exp_content,
  //         idno: baseinfo.certno,
  //         naty: baseinfo.naty,
  //         gend: baseinfo.gend,
  //         age: String(baseinfo.age),
  //         certno: baseinfo.certno,
  //         psn_name: baseinfo.psn_name,
  //         psn_no: baseinfo.psn_no,
  //         psn_cert_type: baseinfo.psn_cert_type,
  //         insuplc_admdvs: insuplc_admdvs,
  //       });

  //       await cbxxRepo.insert(
  //         insuinfo.map((item, index) => ({
  //           lsh,
  //           lshxh,
  //           xh: index + 1,
  //           psn_no: baseinfo.psn_no,
  //           psn_type: item.psn_type,
  //           balc: item.balc,
  //           insutype: item.insutype,
  //           psn_insu_stas: item.psn_insu_stas,
  //           psn_insu_date: item.psn_insu_date,
  //           paus_insu_date: item.paus_insu_date,
  //           cvlserv_flag: item.cvlserv_flag,
  //           emp_name: item.emp_name,
  //           insuplc_admdvs: item.insuplc_admdvs,
  //         })),
  //       );

  //       await sfxxRepo.insert(
  //         idetinfo.map((item, index) => ({
  //           ...item,
  //           lsh,
  //           lshxh,
  //           psn_no: baseinfo.psn_no,
  //           yxbz: 0,
  //           xh: index + 1,
  //         })),
  //       );
  //     } catch (error: any) {
  //       console.error(chsPersonDetail);
  //       logger.error(`保存患者医保失败:${JSON.stringify(chsPersonDetail)}`);
  //       throw new CustomException(ERR.ERR_10000, error.message ?? '保存患者医保失败');
  //     }
  //   });
  // }
  // async saveRegistrationAndPreSettlement(preSettlement: PreSettlement) {
  //   logger.info(`saveRegistrationAndPreSettlement:${JSON.stringify(preSettlement)}`);
  //   return await this.dataSource.transaction(async (manager) => {
  //     try {
  //       const lsh = preSettlement.mdtrtinfo.lsh;

  //       const lshxh = preSettlement.mdtrtinfo.lshxh;

  //       const djxxRepo = manager.getRepository(G10Djxx);

  //       const zdxxRepo = manager.getRepository(G50Zdxx);

  //       const jsxxRepo = manager.getRepository(G60Jsxx);

  //       const fymxRepo = manager.getRepository(G60Fymx);

  //       const jsmxRepo = manager.getRepository(G60Jsmx);

  //       const cfmxRepo = manager.getRepository(h23_cfmx);

  //       const h13_yzzxcsRepo = manager.getRepository(h13_yzzxcs);

  //       const h15_ssxbRepo = manager.getRepository(H15Ssxb);

  //       await djxxRepo.delete({ lsh, lshxh });
  //       await zdxxRepo.delete({ lsh, bz5: lshxh });
  //       await jsxxRepo.delete({ lsh, lshxh });
  //       await fymxRepo.delete({ lsh, lshxh });
  //       await jsmxRepo.delete({ lsh, lshxh });
  //       const maxXh = await zdxxRepo
  //         .createQueryBuilder('zdxx')
  //         .select('MAX(zdxx.xh)', 'maxXh')
  //         .where('zdxx.lsh = :lsh', { lsh })
  //         .getRawOne()
  //         .then((res) => res.maxXh);

  //       await djxxRepo.insert({
  //         ...preSettlement.mdtrtinfo,
  //         jsbz: 3,
  //         bz5: preSettlement?.mdtrtinfo?.bz5?.substring(0, 15) || '',
  //       });
  //       await jsxxRepo.insert({
  //         ...preSettlement.setlinfo,
  //         lsh,
  //         lshxh,
  //         setl_id: '',
  //       });
  //       await zdxxRepo.save(
  //         preSettlement?.diseinfo.map((item, index) => ({
  //           ...item,
  //           xh: maxXh + index + 1,
  //           lsh,
  //           bz5: lshxh,
  //         })),
  //       );

  //       const feedetail = preSettlement?.feedetail || [];
  //       // logger.info(`feedetail-------${JSON.stringify(feedetail)}`)
  //       let index = 0;

  //       for (const item of feedetail) {
  //         index++;

  //         await fymxRepo.save({
  //           ...item,
  //           lsh,
  //           lshxh,
  //           setl_id: '',
  //           mxxh: String(index),
  //           memo: item?.memo?.substring(0, 100) || '',
  //         });
  //         if (preSettlement.mdtrtinfo.jzlx === '1') {
  //           const mxxh = item.bz1 || '';
  //           const sn = item.feedetl_sn || '';
  //           const cfid = sn.startsWith('M')
  //             ? sn.slice(1, sn.length - mxxh.length).trim()
  //             : sn.slice(0, sn.length - mxxh.length).trim();
  //           await cfmxRepo.update(
  //             { cfid, mxxh: Number(item.bz1) },
  //             {
  //               ybzfbl: item?.selfpay_prop,
  //               ypfl: item?.chrgitm_lv,
  //               ybzfje: item?.pric_uplmt_amt,
  //               ybcje: item?.inscp_scp_amt,
  //             },
  //           )
  //         }
  //         if (preSettlement.mdtrtinfo.jzlx === '2') {
  //           const sn = item.feedetl_sn || '';
  //           if (sn.startsWith('Y')) {
  //             const maxid = sn.slice(1, sn.length - 1).trim();
  //             await h13_yzzxcsRepo.update(
  //               { maxid: Number(maxid) },
  //               {
  //                 zfbl: item?.selfpay_prop,
  //                 zfje: item?.pric_uplmt_amt,
  //                 jzje: item?.inscp_scp_amt,
  //                 ybfl: item?.chrgitm_lv,
  //               },
  //             )
  //           }
  //           if (sn.startsWith('S')) {
  //             const maxid = sn.slice(1, sn.length - 1).trim();
  //             await h15_ssxbRepo.update(
  //               { maxid: Number(maxid) },
  //               {
  //                 zfbl: item?.selfpay_prop,
  //                 // zfje: item?.pric_uplmt_amt,
  //                 jzje: item?.inscp_scp_amt,
  //                 ybfl: item?.chrgitm_lv,
  //               },
  //             )
  //           }
  //         }
  //       }
  //       await jsmxRepo.save(
  //         preSettlement?.setldetail.map((item, index) => ({
  //           ...item,
  //           lsh,
  //           lshxh,
  //           mxxh: index + 1,
  //           setl_id: '',
  //         })),
  //       );
  //       return { jsbz: 3 };
  //     } catch (error: any) {
  //       console.error(preSettlement);
  //       logger.error(`医保登记预结算失败:${JSON.stringify(preSettlement)}`);
  //       throw new CustomException(ERR.ERR_10000, error.message ?? '医保登记预结算失败');
  //     }
  //   });
  // }
  async saveSettlement(settlement: Settlement, manager: EntityManager) {
    console.log('saveSettlement', settlement);

    try {
      const invono = settlement.invono;

      const ybdjh = settlement.ybdjh;

      const lsh = settlement.setlinfo.lsh;

      const lshxh = settlement.setlinfo.lshxh;

      const czry = settlement.czry;

      const djxxRepo = manager.getRepository(G10Djxx);

      const jsxxRepo = manager.getRepository(G60Jsxx);

      const jsmxRepo = manager.getRepository(G60Jsmx);

      const dzzhRepo = manager.getRepository(G10Dzzh);

      const dzjsRepo = manager.getRepository(G60Dzjs);

      const djxx = await djxxRepo.findOne({ where: { lsh, lshxh } });

      const jsxx = await jsxxRepo.findOne({ where: { lsh, lshxh } });

      const newJsxx = jsxxRepo.merge(jsxx, {
        ...settlement.setlinfo,
        fyid: djxx.fyid,
      });

      await jsmxRepo.delete({ lsh, lshxh, setl_id: newJsxx.setl_id });

      await jsxxRepo.delete({ lsh, lshxh, setl_id: newJsxx.setl_id });

      await jsxxRepo.save(newJsxx);

      await jsmxRepo.save(
        settlement?.setldetail.map((item, index) => ({
          ...item,
          lsh,
          lshxh,
          mxxh: index + 1,
          setl_id: newJsxx.setl_id,
        })),
      )
      if (settlement?.g10Dzzh && settlement?.g10Dzzh?.setlId && settlement?.g10Dzzh?.mdtrtId) {
        await dzzhRepo.save({
          ...settlement.g10Dzzh,
          lsh: ybdjh,
          fyid: djxx.fyid,
          jssj: new Date(),
          bz1: '1',
          fixmedinsCode: this.fixmedins_code,
        });
        await dzjsRepo.save({
          ...settlement.g10Dzzh,
          lsh: ybdjh,
          lshxh: '10',
          insuType: settlement?.g10Dzzh?.insuTypebs || settlement?.g10Dzzh?.insuType,
        });
        djxx.dzbz = '0';
      }
      await djxxRepo.save({
        ...djxx,
        ...settlement.setlinfo,
        setl_id: newJsxx.setl_id,
        jsbz: 4,
        invono,
        lsh: lsh,
        lshxh: lshxh,
        czry,
        elec_bill_code: invono,
        jssj: settlement.setlinfo.setl_time,
        acct_mulaid_pay: settlement?.g10Dzzh?.acctPay || 0,
      })
      return { jsbz: 4 };
    } catch (error: any) {
      console.error(settlement);
      throw new CustomException(ERR.ERR_10000, error.message ?? '医保结算失败');
    }

  }
  // async cancelSettlement(settlement: Settlement) {
  //   return await this.dataSource.transaction(async (manager) => {
  //     try {
  //       const lsh = settlement.setlinfo.lsh;

  //       const lshxh = settlement.setlinfo.lshxh;

  //       const djxxRepo = manager.getRepository(G10Djxx);

  //       const jsxxZfRepo = manager.getRepository(G60JsxxZf);

  //       const dzjsRepo = manager.getRepository(G60Dzjs);

  //       const dzzhRepo = manager.getRepository(G10Dzzh);

  //       const djxx = await djxxRepo.findOne({ where: { lsh, lshxh } });

  //       djxx.jsbz = 0;

  //       if (settlement?.g60Dzjs && settlement?.g60Dzjs?.setlId && settlement?.g10Dzzh) {
  //         await dzjsRepo.save({
  //           ...settlement.g60Dzjs,
  //           lsh: lsh,
  //           lshxh: lshxh,
  //         });
  //         await dzzhRepo.update(
  //           {
  //             lsh,
  //             setlId: settlement?.g10Dzzh?.setlId || '',
  //           },
  //           { bz1: '9' },
  //         );
  //         djxx.dzbz = '1';
  //       }

  //       await djxxRepo.save(djxx);

  //       await jsxxZfRepo.insert({
  //         ...settlement.setlinfo,
  //         fyid: djxx.fyid,
  //         lsh,
  //         lshxh,
  //       });
  //       return { jsbz: 0 };
  //     } catch (error: any) {
  //       throw new CustomException(ERR.ERR_10000, error.message ?? '医保取消结算失败');
  //     }
  //   });
  // }
  // async cancelPreSettlement(data: { lsh: string; mdtrt_id: string }) {
  //   const djxx = await this.g10DjxxRepo.findOne({
  //     where: { lsh: data.lsh, mdtrt_id: data.mdtrt_id },
  //   });

  //   djxx.jsbz = 0;

  //   await this.g10DjxxRepo.save(djxx);

  //   await this.g60FymxRepo
  //     .createQueryBuilder()
  //     .delete()
  //     .where(`lsh = :lsh and lshxh=0`, { lsh: data.lsh })
  //     .execute();

  //   return { jsbz: 0 };
  // }
  // async saveDjxx(preSettlement: PreSettlement) {
  //   const lsh = preSettlement.mdtrtinfo.lsh;

  //   const lshxh = preSettlement.mdtrtinfo.lshxh;

  //   const djxx = await this.g10DjxxRepo.findOne({
  //     where: {
  //       lsh,
  //       lshxh,
  //     },
  //   });

  //   if (djxx) {
  //     const newDjxx = this.g10DjxxRepo.merge(djxx, {
  //       ...preSettlement.mdtrtinfo,
  //       lsh,
  //       lshxh,
  //     });
  //     await this.g10DjxxRepo.save(newDjxx);
  //   }
  //   await this.g10DjxxRepo.save({ ...preSettlement.mdtrtinfo });
  // }
  // async getChsDetailByInvono(lsh: string, ybdjh: string) {
  //   const [djxx, g10Dzzh, medins_setl_id] = await Promise.all([
  //     this.g10DjxxRepo.findOne({ where: { lsh: ybdjh, ipt_otp_no: lsh } }),
  //     this.g10DzzhRepo.findOne({ where: { lsh: ybdjh } }),
  //     this.g60JsxxRepo
  //       .createQueryBuilder('jsxx')
  //       .select(['medins_setl_id'])
  //       .where(
  //         `exists (select 1 from g10_djxx where g10_djxx.lsh=:lsh and 
  //         ipt_otp_no =:ipt_otp_no and g10_djxx.setl_id = jsxx.setl_id)`,
  //         { lsh: ybdjh, ipt_otp_no: lsh },
  //       )
  //       .getRawOne()
  //       .then((res) => res?.medins_setl_id || ''),
  //   ]);
  //   // const jsxx = await this.g60JsxxRepo.findOne({
  //   //   where: { lsh: ybdjh, setl_id: djxx.setl_id },
  //   //   select: { medins_setl_id: true }
  //   // })
  //   // let djxx = await this.g10DjxxRepo.findOne({ where: { lsh: ybdjh, ipt_otp_no: lsh } })
  //   // // if (!djxx) djxx = await this.g10DjxxRepo.findOne({ where: { lsh: lsh } })
  //   // const jsxx = await this.g60JsxxRepo.findOne({ where: { lsh: djxx?.lsh || '', setl_id: djxx?.setl_id || '', } })
  //   //this.g50ZdxxRepo.find({ where: { lsh, bz5: lshxh } }),
  //   //this.g50ZdxxRepo.find({ where: { lsh, bz5: lshxh } })
  //   return {
  //     ...djxx,
  //     g10Dzzh,
  //     medins_setl_id: medins_setl_id || '',
  //   };
  // }
  // async getChsMaxLshxh(lsh: string) {
  //   const result = await this.g10DjxxRepo
  //     .createQueryBuilder('djxx')
  //     .select('MAX(djxx.lshxh)', 'lshxh')
  //     .where('djxx.lsh = :lsh', { lsh })
  //     .getRawOne();
  //   return `${result?.lshxh?.trim() === '0' ? String(Number(result?.lshxh) + 1) : '0'}`;
  // }
  // async getChsDetail(lsh: string, lshxh: string) {
  //   const [setlinfo, mdtrtinfo, baseinfo, insuinfo, idetinfo, diseinfo, feedetail] =
  //     await Promise.all([
  //       this.g60JsxxRepo.findOne({ where: { lsh, lshxh } }),
  //       this.g10DjxxRepo.findOne({ where: { lsh, lshxh } }),
  //       this.g01RyxxRepo.findOne({ where: { lsh, lshxh } }),
  //       this.g01CbxxRepo.find({ where: { lsh, lshxh } }),
  //       this.g01SfxxRepo.find({ where: { lsh, lshxh } }),
  //       this.g50ZdxxRepo.find({ where: { lsh, bz5: lshxh } }),
  //       this.g60FymxRepo
  //         .createQueryBuilder('fymx')
  //         .leftJoin('fymx.h00_xmzdEntity', 'h00_xmzdEntity')
  //         .leftJoin('h00_xmzdEntity.zflxEntity', 'zflxEntity')
  //         .leftJoin('h00_xmzdEntity.fylbidEntity', 'fylbidEntity')
  //         .addSelect(['h00_xmzdEntity.xmmc', 'zflxEntity.flmc', 'fylbidEntity.fylbmc'])
  //         .leftJoin('fymx.dyzdEntity', 'dyzdEntity')
  //         .addSelect(['dyzdEntity.gjybbm', 'dyzdEntity.gjybmc'])
  //         .where('fymx.lsh=:lsh and lshxh=:lshxh', { lsh, lshxh })
  //         .getMany(),
  //     ]);
  //   return {
  //     setlinfo,
  //     mdtrtinfo,
  //     baseinfo,
  //     insuinfo,
  //     idetinfo,
  //     diseinfo,
  //     feedetail,
  //   };
  // }
  // async getMsgId(data: MsgDto) {
  //   const msgid = this.generateMsgId();
  //   const id = SnowflakeIdGenerator.generate();
  //   const g01Log = this.g01LogRepo.create({
  //     id,
  //     msgid,
  //     infno: data.infno,
  //     lsh: data.lsh,
  //     lshxh: data.lshxh,
  //     psn_no: data.psn_no,
  //     mdtrt_id: data.mdtrt_id,
  //     createtime: new Date(),
  //   });
  //   await this.g01LogRepo.save(g01Log);
  //   return msgid;
  // }

  // generateMsgId() {
  //   const inf_time = dayjs().format('YYYY-MM-DD HH:mm:ss');

  //   const microseconds = Math.floor(performance.now() * 1000) % 1000;

  //   const randomDigits = crypto.randomUUID();
  //   // 生成 msgid 并保证它的长度为 18 个字符
  //   let msgid = `${inf_time.replace(/[^0-9]/g, '')}${microseconds}${randomDigits}`;

  //   msgid = msgid.substring(0, 18);

  //   return `${this.fixmedins_code}${msgid}`;
  // }
}
