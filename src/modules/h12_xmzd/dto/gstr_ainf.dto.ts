import { Allow } from 'class-validator';
import { Type } from 'class-transformer';

export class Gstr_ainfDto {
  @Allow()
  a_profile: string;

  @Allow()
  a_customername: string;

  @Allow()
  a_codeseparator: string;

  @Allow()
  a_codewidth: string;

  @Allow()
  a_passwordperiod: number;

  @Allow()
  a_timeoutseconds: number;

  @Allow()
  a_dwautoappend: boolean;

  @Allow()
  a_dwautoscroll: boolean;

  @Allow()
  a_dwautoupdate: boolean;

  @Allow()
  a_dwpreview: boolean;

  @Allow()
  a_dwprint: boolean;

  @Allow()
  d_dbms: string;

  @Allow()
  d_servername: string;

  @Allow()
  d_database: string;

  @Allow()
  d_userid: string;

  @Allow()
  d_dbpass: string;

  @Allow()
  d_logid: string;

  @Allow()
  d_logpass: string;

  @Allow()
  d_dbparm: string;

  @Allow()
  d_autocommit: string;

  @Allow()
  d_lock: string;

  @Allow()
  d_prompt: string;

  @Allow()
  s_userid: string;

  @Allow()
  s_systemid: string;

  @Allow()
  s_systemname: string;

  @Allow()
  s_workstation: string;

  @Allow()
  s_version: string;

  @Allow()
  s_company: string;

  @Allow()
  s_copyright: string;

  @Allow()
  s_telephone: string;

  @Allow()
  s_postcode: string;

  @Allow()
  s_address: string;

  @Allow()
  s_developers: string;

  @Type(() => Date)
  s_datetime: Date;

  @Allow()
  u_ksid: string;

  @Allow()
  u_ksmc: string;

  @Allow()
  u_zcid: string;

  @Allow()
  u_zwid: string;

  @Allow()
  u_userid: string;

  @Allow()
  u_username: string;

  @Allow()
  u_password: string;

  @Allow()
  u_hzsr: string;

  @Allow()
  u_bmlx: string;

  @Allow()
  u_xgmm: boolean;

  @Allow()
  u_bgmm: boolean;

  @Allow()
  u_mmyx: boolean;

  @Allow()
  u_zhjy: boolean;

  @Allow()
  u_szbm: string;

  @Allow()
  u_pybm: string;

  @Allow()
  u_wbbm: string;

  @Type(() => Date)
  u_datetime: Date;

  @Allow()
  u_qtbm: string;

  @Allow()
  menushow: boolean;

  @Allow()
  s_time: string;

  @Allow()
  s_yzgs: string;

  @Allow()
  s_path: string;

  @Allow()
  s_bmlr: string;

  @Allow()
  url: string;

  @Allow()
  jcdz: string;

  @Allow()
  jcdzxd: string;

  @Allow()
  jcdzbz: string;

  @Allow()
  fyid: string;

  @Allow()
  emr: string;

  @Allow()
  ysgjbm: string;

  @Allow()
  gjjgbm: string;

  @Allow()
  dxbz: string;

  @Allow()
  emr_view: string;

  @Allow()
  cfyymc: string;

  @Allow()
  s_jgdm: string;

  @Allow()
  s_mrksid: string;

  @Allow()
  ksfl: string;
}
