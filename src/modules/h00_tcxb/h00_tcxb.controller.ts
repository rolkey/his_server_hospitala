import { Controller, Get, Param } from '@nestjs/common';
import { H00TcxbService } from './service/h00_tcxb.service';
import { TcxbCombinedResponseDto } from './dto/tcxb-combined-response.dto';

@Controller('h00-tcxb')
export class H00TcxbController {
  constructor(private readonly h00TcxbService: H00TcxbService) {}

  @Get(':tcid')
  async getCombinedData(@Param('tcid') tcid: string): Promise<TcxbCombinedResponseDto[]> {
    return this.h00TcxbService.getCombinedData(tcid);
  }
}
