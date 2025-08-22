import { H31_kcxx } from './modules/h31_kcxx/h31_kcxx.entity';
/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/07 20:30:08
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { ConfigModule } from '@nestjs/config';
import { PermissionModule } from './modules/permission/permission.module';
import { RoleModule } from './modules/role/role.module';
import { AuthModule } from './modules/auth/auth.module';
import { SunsoftModule } from './modules/sunsoft/sunsoft.module';
import { UsrcatModule } from './modules/usrcat/usrcat.module';
import { ModuleModule } from './modules/module/module.module';
import { SystemModule } from './modules/system/system.module';
import { reportModule } from './modules/report/report.module';
import { csxzModule } from './modules/csxz/csxz.module';
import { fyxxModule } from './modules/fyxx/fyxx.module';
import { h00_brlxModule } from './modules/h00_brlx/h00_brlx.module';
import { h00_mzzdModule } from './modules/h00_mzzd/h00_mzzd.module';
import { h20_jzzbModule } from './modules/h20_jzzb/h20_jzzb.module';
import { h00_syffModule } from './modules/h00_syff/h00_syff.module';
import { h00_rybqModule } from './modules/h00_rybq/h00_rybq.module';
import { h00_syplModule } from './modules/h00_sypl/h00_sypl.module';
import { h00_ybflModule } from './modules/h00_ybfl/h00_ybfl.module';
import { h00_ypflModule } from './modules/h00_ypfl/h00_ypfl.module';
import { h11_brxxModule } from './modules/h11_brxx/h11_brxx.module';
import { h12_yzzbModule } from './modules/h12_yzzb/h12_yzzb.module';
import { h13_cwsyxxModule } from './modules/h13_cwsyxx/h13_cwsyxx.module';
import { jbbmicd10Module } from './modules/jbbmicd/jbbmicd10.module';
import { ksmcModule } from './modules/ksmc/ksmc.module';
import { zcmcModule } from './modules/zcmc/zcmc.module';
import { GyIdentityModule } from './modules/gy_identity/gy-identity.module'; // 导入GyIdentityModule
import { SfxmModule } from './modules/h12_xmzd/sfxm.module'; // 导入SfxmModule
import { h13_yzzxcsModule } from './modules/​​h13_yzzxcs​​/h13_yzzxcs.module';
import { H31_kcxxModule } from './modules/h31_kcxx/h31_kcxx.module';
import { H12_mbzbModule } from './modules/h12_mbzb/h12_mbzb.module';
import { H12_mbxbModule } from './modules/h12_mbxb/h12_mbxb.module';
import { Lis_sflbModule } from './modules/lis_sflb/lis_sflb.module';
import { h00_fkfsModule } from './modules/h00_fkfs/h00_fkfs.module';
import { H30_ypzdModule } from './modules/h30_ypzd/h30_ypzd.module';
import { H40SqzbModule } from './modules/h40_sqzb/h40_sqzb.module';
import { h11_zybhModule } from './modules/h11_zybh/h11_zybh.module';
import { H13YzzxcsTfModule } from './modules/h13_yzzxcs_tf/h13-yzzxcs-tf.module';
import { h11_lshModule } from './modules/h11_lsh/h11_lsh.module';
import { H11Jshztzd1Module } from './modules/h11_jshztzd1/h11-jshztzd1.module';
import { H11YjkModule } from './modules/h11_yjk/h11_yjk.module';

@Module({
  imports: [
    /* 配置文件模块 */
    ConfigModule.forRoot({
      isGlobal: true,
      //   envFilePath: [resolve(__dirname, '.env.local') ?? resolve(__dirname, '.env')],
      envFilePath: ['.env'],
      expandVariables: true,
    }),
    UsrcatModule,
    PermissionModule,
    RoleModule,
    AuthModule,
    SharedModule,
    ModuleModule,
    SunsoftModule,
    SystemModule,
    reportModule,
    csxzModule,
    fyxxModule,
    h00_brlxModule,
    h20_jzzbModule,
    h00_mzzdModule,
    h00_rybqModule,
    h00_syffModule,
    h00_syplModule,
    h00_ybflModule,
    h00_ypflModule,
    h11_brxxModule,
    h12_yzzbModule,
    h13_cwsyxxModule,
    jbbmicd10Module,
    ksmcModule,
    zcmcModule,
    GyIdentityModule,
    SfxmModule, // 添加SfxmModule到imports数组
    h13_yzzxcsModule,
    H31_kcxxModule,
    H12_mbzbModule,
    H12_mbxbModule,
    Lis_sflbModule,
    h00_fkfsModule,
    H30_ypzdModule,
    H40SqzbModule,
    h11_zybhModule,
    H13YzzxcsTfModule,
    h11_lshModule,
    H11Jshztzd1Module,
    H11YjkModule,
  ],
})
export class AppModule {}
