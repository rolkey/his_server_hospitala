import { Controller } from '@nestjs/common';
import { h00_rybqService } from './h00_rybq.service';

@Controller('h00_rybq')
export class h00_rybqController {
  constructor(private readonly h00_rybqService: h00_rybqService) {}
}
