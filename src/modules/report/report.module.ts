import { ReportInformation } from './entities/report_information.entity';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { reportController } from './report.controller';
import { report_format } from './entities/report_format.entity';
import { ReportCategory } from './entities/report_category.entity';
import { reportService } from './report.service';
import { report_params } from './entities/report_params.entity';
import { report_sql } from './entities/report_sql.entity';
@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      report_format,
      ReportCategory,
      ReportInformation,
      report_params,
      report_sql,
    ]),
  ],
  controllers: [reportController],
  providers: [reportService],
  exports: [reportService],
})
export class reportModule {}
