import { Controller, Get } from '@nestjs/common';
import { h00_brlxService } from './h00_brlx.service';

@Controller('h00_brlx')
export class h00_brlxController {
  constructor(private readonly h00_brlxService: h00_brlxService) {}

  @Get()
  findAll() {
    return this.h00_brlxService.findAll();
  }
}
