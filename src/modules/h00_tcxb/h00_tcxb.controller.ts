import { Controller, Get, Param } from '@nestjs/common';
import { H00TcxbService } from './service/h00_tcxb.service';
import { TcxbCombinedResponseDto } from './dto/tcxb-combined-response.dto';
import { H00Tcxb } from './entity/h00_tcxb.entity';

@Controller('h00-tcxb')
export class H00TcxbController {
  constructor(private readonly h00TcxbService: H00TcxbService) {}

  @Get(':tcid')
  async getCombinedData(@Param('tcid') tcid: string): Promise<TcxbCombinedResponseDto[]> {
    return this.h00TcxbService.getCombinedData(tcid);
  }

  @Get('syfftc/:syffid')
  async findBySyffid(@Param('syffid') syffid: string): Promise<H00Tcxb[]> {
    return this.h00TcxbService.findBySyffid(syffid);
  }
}
