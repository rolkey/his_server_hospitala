import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SfxmModule } from '@/modules/h12_xmzd/sfxm.module';
import { N0422 } from '../n04_22/n04_22.entity';
import { N04_23 } from '../n04-23/n04-23.entity';
import { N0424 } from '../n04_24/n04_24.entity';
import { N0425 } from '../n04_25/n04_25.entity';
import { N0421 } from './n04_21.entity';
import { N0421Service } from './n04_21.service';
import { N0421Controller } from './n04_21.controller';
import { N0421WorkflowService } from './n04_21.workflow.service';
import { N0421SettlementService } from './n04_21.settlement.service';
import { PatientCaseLockService } from './patient-case-lock.service';

@Module({
  imports: [
    // N04_22/23/24/25 实体供 workflow 事务内更新 sjbz；不引入对应 Module，避免循环依赖
    TypeOrmModule.forFeature([N0421, N0422, N04_23, N0424, N0425]),
    SfxmModule,
  ],
  controllers: [N0421Controller],
  providers: [
    N0421Service,
    N0421WorkflowService,
    N0421SettlementService,
    PatientCaseLockService,
  ],
  exports: [N0421Service, PatientCaseLockService],
})
export class N0421Module {}
